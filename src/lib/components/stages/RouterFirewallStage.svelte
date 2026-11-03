<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterFirewallText } from '$lib/chapters/netlab/router-firewall/types';
	import Missions from './routerlab/Missions.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import {
		LAPTOP_Y,
		NET,
		RY,
		SWITCH_Y,
		laptopXs,
		portC,
		type Mission,
		type RigLaptop,
		type RigPacket
	} from './routerlab/ros';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as RouterFirewallText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- The office: Sari is staff, Budi is the admin ----
	const STAFF = '192.168.88.254';
	const ADMIN = '192.168.88.253';
	const GAME = '45.76.10.20';
	type Chain = 'input' | 'forward';
	type Src = 'any' | 'staff' | 'admin';
	type Target = 'game' | 'winbox' | 'any';
	type Action = 'accept' | 'drop';
	type Rule = { chain: Chain; src: Src; target: Target; action: Action; hits: number; key: number };
	let rules = $state<Rule[]>([]);
	let nextKey = 0;

	// the Winbox style form
	let fChain = $state<Chain>('forward');
	let fSrc = $state<Src>('staff');
	let fTarget = $state<Target>('game');
	let fAction = $state<Action>('drop');

	const srcIp = (s: Src) => (s === 'staff' ? STAFF : s === 'admin' ? ADMIN : '');
	function cli(r: { chain: Chain; src: Src; target: Target; action: Action }) {
		const bits = [`chain=${r.chain}`];
		if (r.target === 'winbox') bits.push('protocol=tcp dst-port=8291');
		if (r.src !== 'any') bits.push(`src-address=${srcIp(r.src)}`);
		if (r.target === 'game') bits.push(`dst-address=${GAME}`);
		bits.push(`action=${r.action}`);
		return `/ip firewall filter add ${bits.join(' ')}`;
	}
	const preview = $derived(cli({ chain: fChain, src: fSrc, target: fTarget, action: fAction }));

	let log = $state<string[]>([]);
	const say = (l: string) => (log = [...log.slice(-5), l]);

	// a rule whose chain can never see its target is legal but useless
	const mismatch = (r: { chain: Chain; target: Target }) =>
		(r.chain === 'input' && r.target === 'game') ||
		(r.chain === 'forward' && r.target === 'winbox');

	function addRule() {
		if (!live || running) return;
		const r = { chain: fChain, src: fSrc, target: fTarget, action: fAction };
		rules = [...rules, { ...r, hits: 0, key: nextKey++ }];
		say(cli(r));
		onstate?.(mismatch(r) ? 'mismatch' : 'added');
	}
	function move(i: number, d: -1 | 1) {
		const j = i + d;
		if (!live || running || j < 0 || j >= rules.length) return;
		const next = [...rules];
		[next[i], next[j]] = [next[j], next[i]];
		rules = next;
		say(`/ip firewall filter move ${i} destination=${d > 0 ? j + 1 : j}`);
		onstate?.('moved');
	}
	function remove(i: number) {
		if (!live || running) return;
		rules = rules.filter((_, k) => k !== i);
		say(`/ip firewall filter remove ${i}`);
	}

	// ---- Tests ----
	type Test = { from: Src; dst: 'game' | 'nimbus' | 'winbox'; want: Action };
	const TESTS: Test[] = [
		{ from: 'staff', dst: 'game', want: 'drop' },
		{ from: 'staff', dst: 'nimbus', want: 'accept' },
		{ from: 'staff', dst: 'winbox', want: 'drop' },
		{ from: 'admin', dst: 'winbox', want: 'accept' }
	];
	let passed = $state<(boolean | null)[]>([null, null, null, null]);
	let running = $state(false);
	let finished = false;

	/** First match wins; with no match RouterOS accepts. Returns the verdict and the rule index. */
	function judge(t: Test): { action: Action; at: number } {
		const chain: Chain = t.dst === 'winbox' ? 'input' : 'forward';
		const at = rules.findIndex(
			(r) =>
				r.chain === chain &&
				(r.src === 'any' || r.src === t.from) &&
				(r.target === 'any' || r.target === t.dst)
		);
		return { action: at < 0 ? 'accept' : rules[at].action, at };
	}

	let packet = $state<RigPacket | null>(null);
	let mark = $state<{ x: number; y: number } | null>(null);
	let glow = $state<string[]>([]);
	let tones = $state<RigLaptop['tone'][]>(['idle', 'idle']);
	let serverTone = $state<'idle' | 'ok' | 'bad'>('idle');
	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 40 : ms));
	let runId = 0;
	$effect(() => () => {
		runId++;
	});

	async function runTests() {
		if (!live || running) return;
		const id = ++runId;
		running = true;
		passed = [null, null, null, null];
		rules = rules.map((r) => ({ ...r, hits: 0 }));
		const xs = laptopXs(2);
		const R = { x: (portC('ether1') + portC('ether2')) / 2, y: RY + 34 };
		const step = async (p: RigPacket | null, ms: number) => {
			if (id !== runId) throw new Error('stale');
			packet = p;
			await wait(ms);
			if (id !== runId) throw new Error('stale');
		};
		try {
			for (let k = 0; k < TESTS.length; k++) {
				const t = TESTS[k];
				const li = t.from === 'staff' ? 0 : 1;
				const lx = xs[li];
				const label = t.dst === 'winbox' ? 'tcp 8291' : t.dst === 'game' ? GAME : 'nimbus.com';
				mark = null;
				serverTone = 'idle';
				tones[li] = 'wait';
				packet = null;
				await step({ x: lx, y: LAPTOP_Y - 8, label, tone: 'go' }, 280);
				await step({ x: lx, y: SWITCH_Y - 6, label, tone: 'go' }, 420);
				glow = ['ether2'];
				await step({ x: R.x, y: R.y, label, tone: 'go' }, 520);
				const v = judge(t);
				if (v.at >= 0) rules[v.at].hits += 1;
				if (v.action === 'drop') {
					mark = { x: R.x, y: R.y };
					await step(null, 520);
				} else if (t.dst === 'winbox') {
					await step({ x: R.x, y: R.y, label, tone: 'ok' }, 520);
				} else {
					glow = ['ether1'];
					await step({ x: NET.x - 30, y: 34, label, tone: 'ok' }, 640);
					serverTone = 'ok';
				}
				const ok = v.action === t.want;
				passed[k] = ok;
				tones[li] = v.action === 'accept' ? 'ok' : 'bad';
				packet = null;
				await wait(320);
			}
		} catch {
			return;
		} finally {
			if (id === runId) {
				running = false;
				glow = [];
				packet = null;
			}
		}
		if (id !== runId) return;
		react();
	}

	function react() {
		if (passed.every(Boolean)) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			} else onstate?.('allPass');
			return;
		}
		if (!passed[3]) {
			const acceptAt = rules.findIndex(
				(r) =>
					r.chain === 'input' &&
					r.action === 'accept' &&
					(r.src === 'admin' || r.src === 'any') &&
					r.target !== 'game'
			);
			return onstate?.(acceptAt >= 0 ? 'order' : 'lockedOut');
		}
		if (!passed[1]) return onstate?.('overBlock');
		if (!passed[0]) return onstate?.('gameOpen');
		if (!passed[2]) return onstate?.('winboxOpen');
	}

	// Help fills the form with the rule a failing test needs (adding and ordering is still yours).
	const FILL: Partial<Record<number, { chain: Chain; src: Src; target: Target; action: Action }>> =
		{
			0: { chain: 'forward', src: 'staff', target: 'game', action: 'drop' },
			2: { chain: 'input', src: 'any', target: 'winbox', action: 'drop' },
			3: { chain: 'input', src: 'admin', target: 'winbox', action: 'accept' }
		};
	function help(k: number) {
		const f = FILL[k];
		if (!f || !live || running) return;
		fChain = f.chain;
		fSrc = f.src;
		fTarget = f.target;
		fAction = f.action;
	}
	const items = $derived<Mission[]>(
		TESTS.map((_, k) => ({
			label: tx.missions[k],
			done: passed[k] === true,
			help: FILL[k] ? () => help(k) : undefined
		}))
	);

	const rigLaps = $derived<RigLaptop[]>([
		{ name: tx.staffName, ip: STAFF, tone: tones[0] },
		{ name: tx.adminName, ip: ADMIN, tone: tones[1] }
	]);
	const srcText = (s: Src) =>
		s === 'any' ? tx.anyone : s === 'staff' ? tx.staffName : tx.adminName;

	const CHAINS: Chain[] = ['input', 'forward'];
	const SRCS: Src[] = ['any', 'staff', 'admin'];
	const TARGETS: Target[] = ['game', 'winbox', 'any'];
	const ACTIONS: Action[] = ['accept', 'drop'];
</script>

<div class="wrap">
	<div class="testbox">
		<Missions
			label={tx.missionsLabel}
			{items}
			hintBtn={tx.hintBtn}
			doneNote={tx.doneNote}
			disabled={!live || running}
		/>
		<button type="button" class="go" disabled={!live || running} onclick={runTests}>
			<svg viewBox="0 0 12 12" aria-hidden="true"
				><path d="M3 2l6 4-6 4z" fill="currentColor" /></svg
			>
			{running ? tx.running : tx.runBtn}
		</button>
	</div>

	<OfficeRig
		isp={tx.ispLabel}
		server={tx.netLabel}
		{serverTone}
		laptops={rigLaps}
		{glow}
		{packet}
		{mark}
	/>

	<div class="win">
		<div class="wbar">{tx.builderTitle}</div>
		<div class="form">
			<div class="row">
				<span class="lab">{tx.chainLabel}</span>
				<div class="seg">
					{#each CHAINS as v (v)}
						<button
							type="button"
							class:on={fChain === v}
							disabled={!live}
							onclick={() => (fChain = v)}>{v}</button
						>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="lab">{tx.srcLabel}</span>
				<div class="seg">
					{#each SRCS as v (v)}
						<button type="button" class:on={fSrc === v} disabled={!live} onclick={() => (fSrc = v)}
							>{srcText(v)}</button
						>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="lab">{tx.targetLabel}</span>
				<div class="seg">
					{#each TARGETS as v (v)}
						<button
							type="button"
							class:on={fTarget === v}
							disabled={!live}
							onclick={() => (fTarget = v)}>{tx.targets[v]}</button
						>
					{/each}
				</div>
			</div>
			<div class="row">
				<span class="lab">{tx.actionLabel}</span>
				<div class="seg">
					{#each ACTIONS as v (v)}
						<button
							type="button"
							class="act {v}"
							class:on={fAction === v}
							disabled={!live}
							onclick={() => (fAction = v)}>{tx.actions[v]}</button
						>
					{/each}
				</div>
			</div>
			<code class="preview">{preview}</code>
			<button type="button" class="add" disabled={!live || running} onclick={addRule}
				>{tx.addBtn}</button
			>
		</div>
	</div>

	<div class="win">
		<div class="wbar">{tx.rulesTitle}</div>
		<div class="rules">
			<div class="rhead">
				<span>#</span><span>chain</span><span>src</span><span>dst</span><span>action</span><span
					>{tx.packetsLabel}</span
				><span></span>
			</div>
			{#each rules as r, i (r.key)}
				<div class="rrow" class:warn={mismatch(r)}>
					<span class="num">{i}</span>
					<span>{r.chain}</span>
					<span>{r.src === 'any' ? tx.anyone : srcText(r.src)}</span>
					<span>{r.target === 'game' ? GAME : r.target === 'winbox' ? 'tcp 8291' : tx.anyone}</span>
					<span class="act {r.action}">{r.action}</span>
					<span class="num">{r.hits}</span>
					<span class="tools">
						<button
							type="button"
							aria-label={tx.upLabel}
							disabled={!live || running || i === 0}
							onclick={() => move(i, -1)}
							><svg viewBox="0 0 12 12"><path d="M3 7.5l3-3 3 3" /></svg></button
						>
						<button
							type="button"
							aria-label={tx.downLabel}
							disabled={!live || running || i === rules.length - 1}
							onclick={() => move(i, 1)}
							><svg viewBox="0 0 12 12"><path d="M3 4.5l3 3 3-3" /></svg></button
						>
						<button
							type="button"
							aria-label={tx.removeLabel}
							disabled={!live || running}
							onclick={() => remove(i)}
							><svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg></button
						>
					</span>
				</div>
			{/each}
			{#if !rules.length}<p class="empty">{tx.emptyRules}</p>{/if}
			<p class="deflt">{tx.defaultRow}</p>
		</div>
	</div>

	<div class="log" aria-label={tx.logTitle}>
		<div class="ltitle">{tx.logTitle}</div>
		{#if !log.length}<div class="ln muted">{tx.termHint}</div>{/if}
		{#each log as l, i (i)}
			<div class="ln"><span class="pr">[admin@nimbus] &gt;</span>{l}</div>
		{/each}
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
	.testbox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.go {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		border-radius: 999px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand);
		color: #fff;
		font-size: 13px;
		font-weight: 750;
		padding: 7px 16px;
	}
	.go svg {
		width: 10px;
		height: 10px;
	}
	.go:disabled {
		opacity: 0.55;
	}

	/* ---- Winbox style windows ---- */
	.win {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		overflow: hidden;
	}
	.wbar {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
		background: var(--color-paper);
		border-bottom: 1px solid var(--color-line);
		padding: 5px 10px;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 8px 10px 10px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.lab {
		flex: none;
		width: 74px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.seg {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		min-width: 0;
	}
	.seg button {
		border-radius: 6px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 11.5px;
		font-weight: 650;
		padding: 3px 8px;
	}
	.seg button.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.seg button.act.drop.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.seg button.act.accept.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.preview {
		display: block;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-muted);
		background: var(--color-paper);
		border-radius: 6px;
		padding: 5px 7px;
		word-break: break-word;
	}
	.add {
		align-self: flex-end;
		border-radius: 7px;
		border: 1px solid var(--color-ink);
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 12px;
		font-weight: 750;
		padding: 5px 14px;
	}
	.add:disabled {
		opacity: 0.5;
	}

	.rules {
		padding: 4px 6px 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
	}
	.rhead,
	.rrow {
		display: grid;
		grid-template-columns: 12px 48px 1fr 1.25fr 40px 22px 62px;
		align-items: center;
		gap: 4px;
		min-height: 24px;
	}
	.rhead {
		color: var(--color-faint);
		font-weight: 700;
		font-size: 9.5px;
		text-transform: uppercase;
	}
	.rrow {
		color: var(--color-ink);
		border-top: 1px solid var(--color-line);
	}
	.rrow span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.rrow.warn {
		background: var(--color-amber-soft);
	}
	.num {
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.act.drop {
		color: var(--color-danger);
		font-weight: 800;
	}
	.act.accept {
		color: var(--color-grass);
		font-weight: 800;
	}
	.tools {
		display: inline-flex;
		gap: 2px;
		justify-content: flex-end;
	}
	.tools button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 19px;
		height: 19px;
		border-radius: 5px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
	}
	.tools button:disabled {
		opacity: 0.35;
	}
	.tools svg {
		width: 11px;
		height: 11px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.empty,
	.deflt {
		margin: 0;
		padding: 5px 2px 0;
		font-family: var(--font-sans, inherit);
		font-size: 11px;
		color: var(--color-faint);
	}
	.deflt {
		border-top: 1px solid var(--color-line);
		margin-top: 4px;
	}

	.log {
		width: 100%;
		border-radius: 11px;
		background: #0f2030;
		border: 1px solid #1d3547;
		padding: 7px 10px 9px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		line-height: 1.5;
	}
	.ltitle {
		font-size: 10px;
		font-weight: 700;
		color: #8aa2b3;
		margin-bottom: 3px;
	}
	.ln {
		color: #eaf1f6;
		word-break: break-word;
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
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
		.rules {
			font-size: 11px;
		}
	}
</style>
