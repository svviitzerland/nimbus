<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterIntroText } from '$lib/chapters/netlab/router-intro/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onlock?: (v: boolean) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as RouterIntroText);

	// Beats that point at the router: show it early, outline the physical ports, then contrast
	// them with logical ports. The terminal itself only takes input on the last beat.
	const PORTS_BEAT = 2;
	const LOGICAL_BEAT = 3;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= PORTS_BEAT);
	});

	// ---- The router ----
	const PORTS = ['ether1', 'ether2', 'ether3', 'ether4', 'ether5'];
	const RUNNING = new Set(['ether1', 'ether2']);
	const portX = (i: number) => 150 + i * 34;

	let identity = $state('MikroTik');
	type Addr = { address: string; network: string; iface: string; dynamic?: boolean };
	let addrs = $state<Addr[]>([
		{ address: '10.20.30.2/24', network: '10.20.30.0', iface: 'ether1', dynamic: true }
	]);
	let glow = $state<string[]>([]);
	const ether2Ip = $derived(addrs.find((a) => !a.dynamic && a.iface === 'ether2')?.address ?? '');

	// ---- Missions ----
	type MissionId = 'identity' | 'interfaces' | 'address' | 'addrPrint';
	const MISSIONS: { id: MissionId; cmd: string }[] = [
		{ id: 'identity', cmd: '/system identity set name=nimbus' },
		{ id: 'interfaces', cmd: '/interface print' },
		{ id: 'address', cmd: '/ip address add address=192.168.88.1/24 interface=ether2' },
		{ id: 'addrPrint', cmd: '/ip address print' }
	];
	let done = $state<Record<MissionId, boolean>>({
		identity: false,
		interfaces: false,
		address: false,
		addrPrint: false
	});
	const doneCount = $derived(MISSIONS.filter((m) => done[m.id]).length);
	let finished = false;

	function complete(m: MissionId) {
		if (done[m]) return;
		done[m] = true;
		if (MISSIONS.every((x) => done[x.id])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			}
		} else onstate?.(m);
	}

	// ---- A tiny RouterOS command line ----
	type Cmd = { kind: 'cmd'; id: string };
	type Menu = { kind: 'menu'; kids: Record<string, Node> };
	type Node = Cmd | Menu;
	const c = (id: string): Cmd => ({ kind: 'cmd', id });
	const m = (kids: Record<string, Node>): Menu => ({ kind: 'menu', kids });
	const ROOT = m({
		interface: m({ print: c('if.print'), ethernet: m({ print: c('if.print') }) }),
		ip: m({
			address: m({ print: c('addr.print'), add: c('addr.add'), remove: c('addr.remove') })
		}),
		system: m({ identity: m({ print: c('id.print'), set: c('id.set') }) })
	});

	function nodeAt(path: string[]): Menu {
		let n: Menu = ROOT;
		for (const p of path) {
			const k = n.kids[p];
			if (k && k.kind === 'menu') n = k;
		}
		return n;
	}
	// RouterOS accepts any unique prefix of a word (e.g. "/int pr").
	function matchKey(keys: string[], w: string): string | 'ambiguous' | null {
		if (keys.includes(w)) return w;
		const hits = keys.filter((k) => k.startsWith(w));
		if (hits.length === 1) return hits[0];
		return hits.length > 1 ? 'ambiguous' : null;
	}
	function lev(a: string, b: string) {
		const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
		for (let j = 1; j <= b.length; j++) d[0][j] = j;
		for (let i = 1; i <= a.length; i++)
			for (let j = 1; j <= b.length; j++)
				d[i][j] = Math.min(
					d[i - 1][j] + 1,
					d[i][j - 1] + 1,
					d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
				);
		return d[a.length][b.length];
	}
	// A near miss (one or two typos, or a typo in an abbreviation) gets a "did you mean".
	function closest(keys: string[], w: string) {
		const limit = w.length <= 3 ? 1 : 2;
		let best = '';
		let score = limit + 1;
		for (const k of keys) {
			const v = Math.min(lev(w, k), w.length < k.length ? lev(w, k.slice(0, w.length)) : 99);
			if (v < score) {
				score = v;
				best = k;
			}
		}
		return best;
	}

	type Ln = { tone: 'cmd' | 'out' | 'tbl' | 'err' | 'muted'; text: string; prompt?: string };
	let menu = $state<string[]>([]);
	let history = $state<Ln[]>([]);
	let input = $state('');
	let typing = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let started = false;

	const promptStr = $derived(`[admin@${identity}] ${menu.length ? '/' + menu.join(' ') : ''}>`);
	const add = (tone: Ln['tone'], t: string) => (history = [...history, { tone, text: t }]);
	const err = (t: string) => add('err', t);
	const hint = (t: string) => add('muted', t);
	const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

	function ipToInt(ip: string) {
		return ip.split('.').reduce((a, o) => a * 256 + Number(o), 0);
	}
	function intToIp(n: number) {
		return [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join('.');
	}
	function parseAddr(v: string): { address: string; network: string } | null {
		const r = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/.exec(v);
		if (!r) return null;
		const oct = r.slice(1, 5).map(Number);
		if (oct.some((o) => o > 255)) return null;
		const p = r[5] === undefined ? 32 : Number(r[5]);
		if (p > 32) return null;
		const ip = oct.join('.');
		const size = 2 ** (32 - p);
		const net = Math.floor(ipToInt(ip) / size) * size;
		return { address: `${ip}/${p}`, network: intToIp(net) };
	}

	type Arg = { k: string; v: string; col: number };
	function readArgs(args: Arg[], allowed: string[]): Record<string, string> | null {
		const out: Record<string, string> = {};
		for (const a of args) {
			const k = matchKey(allowed, a.k.toLowerCase());
			if (!k || k === 'ambiguous') {
				err(`expected end of command (line 1 column ${a.col})`);
				return null;
			}
			out[k] = a.v.replace(/^"|"$/g, '');
		}
		return out;
	}
	function oops(token = 'error') {
		onstate?.(token);
	}

	function printIfaces() {
		add('tbl', 'Flags: R - RUNNING');
		add('tbl', ` #   ${pad('NAME', 8)}${pad('TYPE', 7)}MTU`);
		PORTS.forEach((p, i) =>
			add('tbl', ` ${i} ${RUNNING.has(p) ? 'R' : ' '} ${pad(p, 8)}${pad('ether', 7)}1500`)
		);
	}
	function printAddrs() {
		add('tbl', 'Flags: D - DYNAMIC');
		add('tbl', ` #   ${pad('ADDRESS', 17)}${pad('NETWORK', 14)}INTERFACE`);
		addrs.forEach((a, i) =>
			add(
				'tbl',
				` ${i} ${a.dynamic ? 'D' : ' '} ${pad(a.address, 17)}${pad(a.network, 14)}${a.iface}`
			)
		);
	}

	function exec(id: string, rest: { w: string; col: number }[], args: Arg[]) {
		if (id !== 'addr.remove' && rest.length) {
			err(`expected end of command (line 1 column ${rest[0].col})`);
			return oops();
		}
		if (id === 'if.print') {
			if (args.length) {
				err(`expected end of command (line 1 column ${args[0].col})`);
				return oops();
			}
			printIfaces();
			hint(tx.hintRunning);
			glow = PORTS.filter((p) => RUNNING.has(p));
			complete('interfaces');
			return;
		}
		if (id === 'id.print') {
			add('out', `  name: ${identity}`);
			return;
		}
		if (id === 'id.set') {
			const a = readArgs(args, ['name']);
			if (!a) return oops();
			const name = (a.name ?? '').trim();
			if (!name) {
				err('syntax error (missing value for name)');
				hint(tx.hintName);
				return oops();
			}
			identity = name.slice(0, 20);
			if (name.toLowerCase() === 'nimbus') complete('identity');
			else {
				hint(tx.hintName);
				onstate?.('otherName');
			}
			return;
		}
		if (id === 'addr.print') {
			if (args.length) {
				err(`expected end of command (line 1 column ${args[0].col})`);
				return oops();
			}
			printAddrs();
			hint(tx.hintDynamic);
			glow = [...new Set(addrs.map((a) => a.iface))];
			if (ether2Ip) complete('addrPrint');
			else hint(tx.hintAddFirst);
			return;
		}
		if (id === 'addr.add') {
			const a = readArgs(args, ['address', 'interface', 'network', 'comment', 'disabled']);
			if (!a) return oops();
			if (!a.address || !a.interface) {
				err(`failure: ${!a.address ? 'address' : 'interface'} not specified`);
				hint(tx.hintNeeds);
				return oops();
			}
			const parsed = parseAddr(a.address);
			if (!parsed) {
				err('invalid value for argument address');
				hint(tx.hintAddr);
				return oops('badAddress');
			}
			const iface = a.interface.toLowerCase();
			if (!PORTS.includes(iface)) {
				err(`input does not match any value of interface`);
				hint(tx.hintIface);
				return oops();
			}
			if (addrs.some((x) => x.address === parsed.address && x.iface === iface)) {
				err('failure: already have such address');
				return;
			}
			addrs = [...addrs, { ...parsed, iface }];
			glow = [iface];
			if (iface === 'ether2') complete('address');
			else {
				hint(tx.hintWrongPort);
				onstate?.('wrongPort');
			}
			return;
		}
		if (id === 'addr.remove') {
			const a = readArgs(args, ['numbers']);
			if (!a) return oops();
			const n = Number(a.numbers ?? rest[0]?.w);
			const item = Number.isInteger(n) ? addrs[n] : undefined;
			if (!item) {
				err('no such item');
				return oops();
			}
			if (item.dynamic) {
				err('failure: can not remove dynamic address');
				return;
			}
			addrs = addrs.filter((_, i) => i !== n);
			return;
		}
	}

	function run(raw: string) {
		const line = raw.trim();
		if (!line) return;
		if (!started) {
			started = true;
			history = [];
		}
		history = [...history, { tone: 'cmd', text: line, prompt: promptStr }];

		const here = nodeAt(menu);
		if (line === '?' || line === 'help') {
			add('out', Object.keys(here.kids).join('   '));
			return;
		}

		const toks = line.match(/[^\s"=]+="[^"]*"|\S+/g) ?? [];
		const path = line.startsWith('/') ? [] : [...menu];
		const words: { w: string; col: number }[] = [];
		const args: Arg[] = [];
		let cur = 0;
		for (const tok of toks) {
			const at = line.indexOf(tok, cur);
			cur = at + tok.length;
			const eq = tok.indexOf('=');
			if (eq > 0) args.push({ k: tok.slice(0, eq), v: tok.slice(eq + 1), col: at + 1 });
			else if (args.length) words.push({ w: tok, col: at + 1 });
			else
				for (const part of tok.split('/'))
					if (part) words.push({ w: part, col: line.indexOf(part, at) + 1 });
		}

		let node: Node = nodeAt(path);
		let i = 0;
		for (; i < words.length; i++) {
			if (node.kind === 'cmd') break;
			const w = words[i].w.toLowerCase();
			if (w === '..') {
				path.pop();
				node = nodeAt(path);
				continue;
			}
			const keys = Object.keys(node.kids);
			const k = matchKey(keys, w);
			if (k === 'ambiguous') {
				err(`ambiguous value of ${words[i].w} (line 1 column ${words[i].col})`);
				hint(tx.hintUnknown);
				return oops();
			}
			if (!k) {
				err(`bad command name ${words[i].w} (line 1 column ${words[i].col})`);
				const near = closest(keys, w);
				hint(near ? tx.didYouMean.replace('{word}', near) : tx.hintUnknown);
				return oops();
			}
			node = node.kids[k];
			if (node.kind === 'menu') path.push(k);
		}
		const rest = words.slice(i);
		if (node.kind === 'menu') {
			if (args.length || rest.length) {
				const col = (rest[0] ?? args[0]).col;
				err(`syntax error (line 1 column ${col})`);
				hint(tx.hintUnknown);
				return oops();
			}
			menu = path; // just moving into a menu, like "/ip address"
			return;
		}
		exec(node.id, rest, args);
	}

	function submit(e: Event) {
		e.preventDefault();
		if (!live || typing) return;
		const v = input;
		input = '';
		run(v);
	}

	// Hint chips type the command out for you, then press Enter.
	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	let timer: ReturnType<typeof setInterval> | undefined;
	let pause: ReturnType<typeof setTimeout> | undefined;
	function typeFor(cmd: string) {
		if (!live || typing) return;
		if (reduced) {
			input = '';
			run(cmd);
			return;
		}
		typing = true;
		input = '';
		let n = 0;
		timer = setInterval(() => {
			n += 1;
			input = cmd.slice(0, n);
			if (n >= cmd.length) {
				clearInterval(timer);
				pause = setTimeout(() => {
					input = '';
					typing = false;
					run(cmd);
				}, 220);
			}
		}, 22);
	}
	$effect(() => () => {
		clearInterval(timer);
		clearTimeout(pause);
	});

	// Seed a helper line (kept language synced until the first real command).
	$effect(() => {
		if (started) return;
		const h = tx.termHint;
		if (history.length === 0 || (history.length === 1 && history[0].text !== h))
			history = [{ tone: 'muted', text: h }];
	});
	$effect(() => {
		void history.length;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});

	const teach = $derived(beat === PORTS_BEAT || beat === LOGICAL_BEAT);
	const caption = $derived(beat === LOGICAL_BEAT ? tx.logicalCaption : tx.portsCaption);
</script>

<div class="wrap">
	<div class="missions">
		<div class="mhead">
			<span>{tx.missionsLabel}</span>
			<span class="count">{doneCount}/{MISSIONS.length}</span>
		</div>
		{#each MISSIONS as ms, i (ms.id)}
			<div class="mrow" class:ok={done[ms.id]}>
				<span class="box" aria-hidden="true">
					{#if done[ms.id]}<svg viewBox="0 0 16 16"
							><path
								d="M3.5 8.5l3 3 6-7"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>{/if}
				</span>
				<span class="mlabel">{tx.missions[i]}</span>
				{#if !done[ms.id]}
					<button
						type="button"
						class="chip"
						disabled={!live || typing}
						onclick={() => typeFor(ms.cmd)}
					>
						<svg viewBox="0 0 12 12" aria-hidden="true"
							><path d="M3 2l6 4-6 4z" fill="currentColor" /></svg
						>{tx.hintBtn}
					</button>
				{/if}
			</div>
		{/each}
		{#if doneCount === MISSIONS.length}<p class="mdone">{tx.doneNote}</p>{/if}
	</div>

	<div class="rigbox">
		<svg
			class="rig"
			viewBox="0 0 340 166"
			role="img"
			aria-label="MikroTik, ether1 ether2 ether3 ether4 ether5"
		>
			<!-- ISP and the office laptop, each on its own cable -->
			<g>
				<rect x="68" y="6" width="64" height="30" rx="8" class="dev" />
				<circle cx="86" cy="21" r="7" fill="none" class="devline" stroke-width="1.4" />
				<ellipse cx="86" cy="21" rx="3" ry="7" fill="none" class="devline" stroke-width="1.2" />
				<path d="M79 21h14" class="devline" stroke-width="1.2" />
				<text x="112" y="25" class="dtxt" text-anchor="middle">{tx.ispLabel}</text>
			</g>
			<g>
				<rect x="206" y="4" width="48" height="29" rx="3.5" class="dev" />
				<rect x="210" y="8" width="40" height="21" rx="1.5" class="scr" />
				<path d="M198 33h64l-4 5h-56z" class="dev" />
				<text x="268" y="24" class="dlab">{tx.laptopLabel}</text>
			</g>
			<path
				d="M164 100C164 70 100 72 100 36"
				class="cable isp"
				class:hot={glow.includes('ether1')}
			/>
			<path
				d="M198 100C198 70 230 70 230 38"
				class="cable lan"
				class:hot={glow.includes('ether2')}
			/>

			<!-- the router body -->
			<rect x="14" y="62" width="312" height="70" rx="10" class="body" />
			<text x="30" y="90" class="brand">MikroTik</text>
			<text x="30" y="107" class="ident" class:named={identity.toLowerCase() === 'nimbus'}
				>{identity}</text
			>
			<circle cx="33" cy="120" r="2.6" class="pwr" />
			<text x="40" y="123" class="tiny">PWR</text>

			{#each PORTS as p, i (p)}
				{@const x = portX(i)}
				{#if glow.includes(p)}
					<rect x={x - 3} y="72" width="34" height="42" rx="5" class="halo" />
				{:else if teach}
					<rect x={x - 3} y="72" width="34" height="42" rx="5" class="teach" />
				{/if}
				<circle
					cx={x + 14}
					cy="79"
					r="2.6"
					class="led"
					class:on={RUNNING.has(p)}
					style="animation-delay:{i * 0.37}s"
				/>
				<path d="M{x} 86h28v24h-8v-4h-12v4h-8z" class="hole" />
				{#if RUNNING.has(p)}
					<rect x={x + 4} y="89" width="20" height="14" rx="1.5" class="plug" />
				{/if}
				<text x={x + 14} y="146" class="plab" class:lit={glow.includes(p)} text-anchor="middle"
					>{p}</text
				>
			{/each}
			{#if ether2Ip}
				<text x={portX(1) + 14} y="160" class="ipb" text-anchor="middle">{ether2Ip}</text>
			{/if}
		</svg>
		<p class="cap" class:warn={beat === LOGICAL_BEAT}>{caption}</p>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="term" onclick={() => inputEl?.focus()}>
		<div class="tbar">
			<span class="dots"><i></i><i></i><i></i></span>
			<span class="thost">RouterOS, {identity}</span>
		</div>
		<div class="tbody" bind:this={bodyEl}>
			{#each history as l, i (i)}
				<div class="ln {l.tone}">
					{#if l.tone === 'cmd'}<span class="pr">{l.prompt}</span>{/if}{l.text}
				</div>
			{/each}
			<form class="ln cmd active" onsubmit={submit}>
				<span class="pr">{promptStr}</span>
				<input
					class="tin"
					bind:this={inputEl}
					bind:value={input}
					readonly={typing}
					disabled={!live}
					spellcheck="false"
					autocapitalize="off"
					autocomplete="off"
					aria-label={tx.inputLabel}
				/>
			</form>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 400px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}

	/* ---- Missions ---- */
	.missions {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 10px 6px;
	}
	.mhead {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding: 0 2px 4px;
	}
	.count {
		font-variant-numeric: tabular-nums;
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 28px;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.mrow.ok {
		color: var(--color-grass);
	}
	.box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 16px;
		height: 16px;
		border-radius: 5px;
		border: 1.5px solid var(--color-line);
	}
	.mrow.ok .box {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.box svg {
		width: 12px;
		height: 12px;
	}
	.mlabel {
		flex: 1;
		min-width: 0;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex: none;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		padding: 3px 10px 3px 8px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}
	.chip svg {
		width: 9px;
		height: 9px;
		color: var(--color-brand);
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	.mdone {
		margin: 4px 0 2px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
		text-align: center;
	}

	/* ---- Router drawing ---- */
	.rigbox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.rig {
		width: 100%;
		max-width: 380px;
		height: auto;
		overflow: visible;
	}
	.dev {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.devline {
		stroke: var(--color-brand);
	}
	.scr {
		fill: var(--color-brand-soft);
	}
	.dtxt {
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.dlab {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.cable {
		fill: none;
		stroke-width: 4;
		stroke-linecap: round;
		transition: filter 0.3s ease;
	}
	.cable.isp {
		stroke: var(--color-brand);
	}
	.cable.lan {
		stroke: var(--color-amber);
	}
	.cable.hot {
		filter: drop-shadow(0 0 3px rgba(91, 211, 138, 0.9));
	}
	.body {
		fill: #262b31;
		stroke: #3a4149;
		stroke-width: 1.5;
	}
	.brand {
		font-size: 14px;
		font-weight: 800;
		fill: #f2f4f6;
		letter-spacing: 0.01em;
	}
	.ident {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		fill: #8d9aa6;
	}
	.ident.named {
		fill: #6fd39a;
	}
	.pwr {
		fill: #5bbd84;
	}
	.tiny {
		font-size: 7px;
		font-weight: 700;
		fill: #8d9aa6;
		letter-spacing: 0.06em;
	}
	.hole {
		fill: #0d1013;
		stroke: #4a525b;
		stroke-width: 1;
	}
	.plug {
		fill: #d6dde3;
	}
	.led {
		fill: #4a5058;
	}
	.led.on {
		fill: #6fd39a;
		animation: link 1.3s steps(2) infinite;
	}
	@keyframes link {
		50% {
			fill: #2f7d54;
		}
	}
	.halo {
		fill: rgba(111, 211, 154, 0.14);
		stroke: #6fd39a;
		stroke-width: 2;
		animation: glow 1.6s ease-in-out infinite;
	}
	.teach {
		fill: rgba(221, 158, 54, 0.12);
		stroke: var(--color-amber);
		stroke-width: 2;
		animation: glow 1.6s ease-in-out infinite;
	}
	@keyframes glow {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}
	.plab {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.plab.lit {
		fill: var(--color-grass);
	}
	.ipb {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.cap {
		margin: 0;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.cap.warn {
		color: var(--color-amber);
	}

	/* ---- Terminal (same look as the CLI lesson) ---- */
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.28);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
		cursor: text;
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 12px;
		background: #15293a;
		border-bottom: 1px solid #1d3547;
	}
	.dots {
		display: inline-flex;
		gap: 5px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.dots i:nth-child(1) {
		background: #e06a5b;
	}
	.dots i:nth-child(2) {
		background: #e0b65b;
	}
	.dots i:nth-child(3) {
		background: #5bbd84;
	}
	.thost {
		font-size: 11px;
		font-weight: 600;
		color: #8aa2b3;
	}
	.tbody {
		display: flex;
		flex-direction: column;
		gap: 3px;
		height: 178px;
		overflow: auto;
		padding: 11px 12px;
		font-size: 11.5px;
		line-height: 1.5;
	}
	.ln {
		color: #93a7b6;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.tbl {
		white-space: pre;
		word-break: normal;
		color: #d2e2ee;
	}
	.ln.out {
		color: #d2e2ee;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.err {
		color: #ff9d92;
	}
	.ln.muted {
		color: #6b8496;
		font-style: italic;
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.active {
		display: flex;
		align-items: baseline;
	}
	.tin {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		caret-color: #6fd39a;
		padding: 0;
		box-shadow: none;
	}
	.tin:focus {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.led.on,
		.halo,
		.teach {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
		.mrow {
			font-size: 13px;
		}
		.tbody {
			font-size: 13px;
			height: 200px;
		}
	}
</style>
