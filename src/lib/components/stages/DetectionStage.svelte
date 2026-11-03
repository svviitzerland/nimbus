<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DetectionText } from '$lib/chapters/security/detection/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DetectionText);

	// Log lines are real machine output, so they stay in English in every language.
	type Log = {
		t: number;
		src: 'sshd' | 'web';
		ip: string;
		msg: string;
		fail: boolean;
		user?: string;
	};

	const ATTACKER = '203.0.113.7';
	const SLEEPY = '198.51.100.24';
	const NEWCOMER = '192.0.2.66';
	const NAMES = ['root', 'admin', 'test', 'ubuntu', 'oracle', 'user', 'pi', 'git', 'deploy'];

	function ssh(t: number, ip: string, user: string, ok = false): Log {
		return {
			t,
			src: 'sshd',
			ip,
			user,
			fail: !ok,
			msg: `${ok ? 'Accepted' : 'Failed'} password for ${user} from ${ip}`
		};
	}
	function web(t: number, ip: string, path: string, code = 200): Log {
		return { t, src: 'web', ip, fail: false, msg: `${ip} "GET ${path}" ${code}` };
	}

	// Two quiet minutes at nimbus.com, with one bot hammering SSH somewhere inside.
	function buildLogs(): Log[] {
		const out: Log[] = [];
		for (let i = 0; i < 26; i++) out.push(ssh(68 + i * 4, ATTACKER, NAMES[i % NAMES.length]));
		out.push(ssh(90, SLEEPY, 'rina'), ssh(101, SLEEPY, 'rina'), ssh(115, SLEEPY, 'rina', true));
		const visits: [number, string, string, number?][] = [
			[61, '192.0.2.15', '/'],
			[64, '192.0.2.15', '/products'],
			[73, '198.51.100.8', '/'],
			[79, '198.51.100.8', '/blog'],
			[86, '192.0.2.40', '/'],
			[95, '192.0.2.99', '/oldpage', 404],
			[97, '192.0.2.40', '/cart'],
			[108, '203.0.113.90', '/'],
			[118, '198.51.100.24', '/'],
			[126, '192.0.2.15', '/checkout'],
			[134, '203.0.113.90', '/products'],
			[141, '192.0.2.99', '/robots.txt'],
			[149, '198.51.100.8', '/about'],
			[157, '192.0.2.40', '/products'],
			[163, '203.0.113.90', '/cart'],
			[170, '192.0.2.15', '/']
		];
		for (const [t, ip, p, c] of visits) out.push(web(t, ip, p, c));
		return out.sort((a, b) => a.t - b.t);
	}
	const logs = buildLogs();

	// What streams in once the SIEM is watching, a fresh bot among normal visitors.
	function buildLive(): Log[] {
		const out: Log[] = [];
		const extra = ['/', '/products', '/blog', '/cart'];
		for (let i = 0; i < 14; i++) {
			out.push(ssh(200 + i * 3, NEWCOMER, NAMES[(i + 3) % NAMES.length]));
			if (i % 3 === 1) out.push(web(201 + i * 3, '198.51.100.8', extra[i % extra.length]));
		}
		return out;
	}
	const liveLogs = buildLive();

	function clock(t: number) {
		const m = Math.floor(t / 60);
		const s = t % 60;
		return `10:0${m}:${String(s).padStart(2, '0')}`;
	}

	let query = $state('');
	let selected = $state<string | null>(null);
	let marked = $state(false);
	let searched = false;
	let siemOn = $state(false);
	let streamed = $state<Log[]>([]);
	let alert = $state(false);
	let completed = false;
	let timer: ReturnType<typeof setInterval> | undefined;

	const shown = $derived(
		query.trim()
			? logs.filter((l) =>
					`${clock(l.t)} ${l.src} ${l.msg}`.toLowerCase().includes(query.trim().toLowerCase())
				)
			: logs
	);

	$effect(() => {
		const n = shown.length;
		if (!searched && query.trim() && n > 0 && n < logs.length) {
			searched = true;
			onstate?.('search');
		}
	});

	const info = $derived.by(() => {
		if (!selected) return null;
		const mine = logs.filter((l) => l.ip === selected);
		const failed = mine.filter((l) => l.fail);
		return {
			lines: mine.length,
			failed: failed.length,
			users: [...new Set(failed.map((l) => l.user))].slice(0, 6)
		};
	});

	function mark() {
		if (!selected || marked) return;
		if (selected === ATTACKER) {
			marked = true;
			onstate?.('found');
		} else onstate?.('innocent');
	}

	const newcomerFails = $derived(streamed.filter((l) => l.ip === NEWCOMER && l.fail).length);

	function startSiem() {
		if (siemOn) return;
		siemOn = true;
		let i = 0;
		timer = setInterval(() => {
			if (i >= liveLogs.length) return stop();
			streamed.push(liveLogs[i++]);
			if (newcomerFails > 10 && !alert) {
				alert = true;
				stop();
				onstate?.('siem');
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
		}, 320);
	}
	function stop() {
		if (timer) clearInterval(timer);
		timer = undefined;
	}

	onDestroy(stop);
</script>

{#snippet line(l: Log, tappable: boolean)}
	{#if tappable}
		<button
			type="button"
			class="ln"
			class:fail={l.fail}
			class:sel={selected === l.ip}
			class:bad={marked && l.ip === ATTACKER}
			onclick={() => (selected = l.ip)}
		>
			<span class="t">{clock(l.t)}</span>
			<span class="src">{l.src}</span>
			<span class="msg">{l.msg}</span>
		</button>
	{:else}
		<div class="ln" class:fail={l.fail} class:bad={l.ip === NEWCOMER && alert}>
			<span class="t">{clock(l.t)}</span>
			<span class="src">{l.src}</span>
			<span class="msg">{l.msg}</span>
		</div>
	{/if}
{/snippet}

<div class="wrap">
	{#if !siemOn}
		<div class="top">
			{#if marked}
				<CallToActionButton onclick={startSiem}>
					{#snippet children()}{tx.siemBtn}{/snippet}
				</CallToActionButton>
			{:else}
				<label class="search">
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2" />
						<path
							d="m16 16 4.5 4.5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					<input
						type="search"
						bind:value={query}
						placeholder={tx.searchLabel}
						aria-label={tx.searchLabel}
						autocomplete="off"
						spellcheck="false"
					/>
				</label>
				<div class="chips">
					<span>{tx.tryLabel}</span>
					{#each ['Failed', 'Accepted', '404'] as w (w)}
						<button type="button" class:on={query === w} onclick={() => (query = w)}>{w}</button>
					{/each}
				</div>
			{/if}
		</div>

		<p class="hint">
			{shown.length ? tx.countLabel.replace('{n}', String(shown.length)) : tx.noMatch}
			{#if !selected && shown.length}<span class="sub">{tx.tapHint}</span>{/if}
		</p>

		<div class="logbox">
			{#each shown as l, i (i + l.msg)}
				{@render line(l, true)}
			{/each}
		</div>

		{#if selected && info}
			<div class="panel">
				<div class="phead">
					<code>{selected}</code>
					{#if marked && selected === ATTACKER}<span class="tag">{tx.markedTag}</span>{/if}
				</div>
				<p class="stat">
					{tx.ipLines.replace('{n}', String(info.lines))}
					<span class:hot={info.failed > 10}>{tx.ipFailed.replace('{n}', String(info.failed))}</span
					>
				</p>
				{#if info.users.length}
					<p class="users"><b>{tx.ipUsers}</b> {info.users.join(', ')}</p>
				{/if}
				{#if !marked}
					<button type="button" class="markbtn" onclick={mark}>{tx.markBtn}</button>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="rule">
			<b>{tx.ruleTitle}</b>
			<p>{tx.ruleText}</p>
			<div class="count">
				<code>{NEWCOMER}</code>
				<span class="track"
					><span class="fill" style="width:{Math.min(100, (newcomerFails / 11) * 100)}%"
					></span></span
				>
				<span class="n">{newcomerFails}</span>
			</div>
		</div>

		{#if alert}
			<div class="alert" role="status">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M12 3 2.5 20h19Z"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
					<path
						d="M12 10v4.5M12 17.2v.1"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
					/>
				</svg>
				<span><b>{tx.alertTitle}</b> {tx.alertText.replace('{ip}', NEWCOMER)}</span>
			</div>
		{:else}
			<p class="hint"><span class="dot"></span>{tx.liveLabel}</p>
		{/if}

		<div class="logbox live">
			{#each streamed.slice(-9) as l, i (l.t + l.msg + i)}
				{@render line(l, false)}
			{/each}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		overflow-y: auto;
	}
	.top {
		display: flex;
		width: 100%;
		min-height: 46px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.top :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.search {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 11px;
		color: var(--color-faint);
		transition: border-color 0.2s;
	}
	.search:focus-within {
		border-color: var(--color-brand);
	}
	.search input {
		min-width: 0;
		flex: 1;
		border: none;
		background: transparent;
		font-size: 13px;
		color: var(--color-ink);
		outline: none;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.chips button {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 2px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.chips button.on,
	.chips button:hover {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.hint {
		display: flex;
		min-height: 1.4em;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 2px 8px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.hint .sub {
		font-weight: 500;
		color: var(--color-faint);
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-danger);
		animation: blink 1s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}

	/* the log wall, a dark terminal like the rest of the site */
	.logbox {
		display: flex;
		width: 100%;
		height: 218px;
		flex: none;
		flex-direction: column;
		gap: 1px;
		overflow-y: auto;
		border-radius: 12px;
		border: 1px solid #1d3547;
		background: #10212f;
		padding: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.logbox.live {
		height: auto;
		min-height: 160px;
		justify-content: flex-end;
	}
	.ln {
		display: flex;
		width: 100%;
		flex: none;
		gap: 6px;
		border-radius: 5px;
		padding: 2px 5px;
		text-align: left;
		font-size: 10px;
		line-height: 1.45;
		color: #b9c6d2;
	}
	button.ln:hover {
		background: rgba(255, 255, 255, 0.06);
	}
	.ln.fail .msg {
		color: #e7b25f;
	}
	.ln.sel {
		background: rgba(91, 151, 240, 0.2);
	}
	.ln.bad {
		background: rgba(224, 106, 91, 0.22);
	}
	.ln.bad .msg {
		color: #f09486;
	}
	.t {
		flex: none;
		color: #6c8396;
	}
	.src {
		flex: none;
		width: 30px;
		color: #7fb0e8;
	}
	.msg {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.panel {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.phead {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.phead code,
	.count code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.tag {
		border-radius: 999px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-size: 9.5px;
		font-weight: 800;
		padding: 1px 8px;
	}
	.stat {
		display: flex;
		flex-wrap: wrap;
		gap: 2px 10px;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.stat .hot {
		font-weight: 800;
		color: var(--color-danger);
	}
	.users {
		font-size: 11px;
		color: var(--color-muted);
	}
	.users b {
		font-weight: 800;
		color: var(--color-faint);
	}
	.markbtn {
		align-self: flex-start;
		margin-top: 2px;
		border-radius: 9px;
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 11.5px;
		font-weight: 700;
		padding: 6px 12px;
	}
	.markbtn:hover {
		filter: brightness(1.15);
	}

	.rule {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
		border-radius: 14px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 9px 12px;
	}
	.rule b {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.rule p {
		font-size: 12px;
		font-weight: 600;
		line-height: 1.35;
		color: var(--color-ink);
	}
	.count {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.count .track {
		position: relative;
		flex: 1;
		height: 7px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-card);
	}
	.count .fill {
		position: absolute;
		inset: 0 auto 0 0;
		background: var(--color-danger);
		transition: width 0.25s ease;
	}
	.count .n {
		width: 18px;
		text-align: right;
		font-size: 12px;
		font-weight: 800;
		color: var(--color-danger);
		font-variant-numeric: tabular-nums;
	}
	.alert {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 8px;
		border-radius: 12px;
		background: var(--color-danger);
		color: #fff;
		padding: 8px 12px;
		font-size: 12.5px;
		animation: pop 0.3s ease;
	}
	.alert b {
		font-weight: 800;
	}
	@keyframes pop {
		from {
			transform: scale(0.92);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.alert {
			animation: none;
		}
		.count .fill {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
		}
		.ln {
			font-size: 11px;
		}
		.logbox {
			height: 250px;
		}
	}
</style>
