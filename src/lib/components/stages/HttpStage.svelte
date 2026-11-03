<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { HttpText, HttpMissionId, HttpPath } from '$lib/chapters/web/http/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as HttpText);

	type Method = 'GET' | 'POST';
	const METHODS: Method[] = ['GET', 'POST'];
	const PATHS: HttpPath[] = ['/', '/about', '/messages', '/pricing', '/report'];
	const ORDER: HttpMissionId[] = ['read', 'send', 'missing', 'broken'];

	let method = $state<Method>('GET');
	let path = $state<HttpPath>('/');
	let body = $state(untrack(() => tx.bodyDefault));

	// What actually went out. The guestbook snapshot is kept so the answer never changes later.
	type Sent = { method: Method; path: HttpPath; body: string; book: string[] };
	let sent = $state<Sent | null>(null);
	let phase = $state<'idle' | 'going' | 'working' | 'back' | 'shown'>('idle');
	// The guestbook on the server. Nim already left a note.
	let book = $state<string[]>(['Hello!']);

	const done = new SvelteSet<HttpMissionId>();
	let finished = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	type Screen = 'home' | 'about' | 'messages' | 'created' | 'notFound' | 'broken' | 'notAllowed';
	type Res = {
		code: number;
		reason: string;
		type: string;
		extra?: string;
		body: string;
		token: string;
		screen: Screen;
	};

	function respond(s: Sent): Res {
		const sc = tx.screen;
		if (s.path === '/pricing')
			return {
				code: 404,
				reason: 'Not Found',
				type: 'text/html',
				body: `<h1>404 ${sc.notFound}</h1>`,
				token: 'notfound',
				screen: 'notFound'
			};
		if (s.path === '/report')
			return {
				code: 500,
				reason: 'Internal Server Error',
				type: 'text/html',
				body: `<h1>500 ${sc.broken}</h1>`,
				token: 'broken',
				screen: 'broken'
			};
		if (s.path === '/messages') {
			if (s.method === 'POST')
				return {
					code: 201,
					reason: 'Created',
					type: 'application/json',
					body: JSON.stringify({ id: s.book.length + 1, text: s.body }),
					token: 'created',
					screen: 'created'
				};
			const rows = s.book.map((m) => '  ' + JSON.stringify({ text: m }));
			return {
				code: 200,
				reason: 'OK',
				type: 'application/json',
				body: `[\n${rows.join(',\n')}\n]`,
				token: 'list',
				screen: 'messages'
			};
		}
		if (s.method === 'POST')
			return {
				code: 405,
				reason: 'Method Not Allowed',
				type: 'text/html',
				extra: 'Allow: GET',
				body: `<h1>405 ${sc.notAllowed}</h1>`,
				token: 'notallowed',
				screen: 'notAllowed'
			};
		const home = s.path === '/';
		return {
			code: 200,
			reason: 'OK',
			type: 'text/html',
			body: home ? `<h1>${sc.home}</h1>` : `<h1>${sc.about}</h1>\n<p>${sc.aboutText}</p>`,
			token: 'ok',
			screen: home ? 'home' : 'about'
		};
	}

	const res = $derived(sent ? respond(sent) : null);

	const reqText = $derived.by(() => {
		if (!sent) return '';
		const lines = [`${sent.method} ${sent.path} HTTP/1.1`, 'Host: nimbus.com'];
		if (sent.method === 'GET') {
			lines.push(`Accept: ${sent.path === '/messages' ? 'application/json' : 'text/html'}`);
		} else {
			lines.push('Content-Type: application/json', '', JSON.stringify({ text: sent.body }));
		}
		return lines.join('\n');
	});

	const resText = $derived.by(() => {
		if (!res) return '';
		const lines = [`HTTP/1.1 ${res.code} ${res.reason}`, `Content-Type: ${res.type}`];
		if (res.extra) lines.push(res.extra);
		lines.push('', res.body);
		return lines.join('\n');
	});

	const tone = $derived(!res ? '' : res.code >= 500 ? 'bad' : res.code >= 400 ? 'warn' : 'good');
	const note = $derived(
		!res
			? ''
			: res.code >= 500
				? tx.statusNotes.server
				: res.code >= 400
					? tx.statusNotes.client
					: tx.statusNotes.ok
	);
	const busy = $derived(phase === 'going' || phase === 'working' || phase === 'back');
	const current = $derived(ORDER.find((m) => !done.has(m)));

	function missionFor(code: number): HttpMissionId | undefined {
		if (code === 200) return 'read';
		if (code === 201) return 'send';
		if (code === 404) return 'missing';
		if (code === 500) return 'broken';
		return undefined;
	}

	function send() {
		if (busy) return;
		timers.forEach(clearTimeout);
		timers = [];
		const msg = body.trim().slice(0, 40) || tx.bodyDefault;
		const s: Sent = { method, path, body: msg, book: [...book] };
		// a POST to the guestbook stores the message on the server right away
		if (method === 'POST' && path === '/messages') book.push(msg);
		sent = s;
		const quick =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		const t = quick ? 120 : 850;
		phase = 'going';
		timers.push(setTimeout(() => (phase = 'working'), t));
		timers.push(setTimeout(() => (phase = 'back'), t + (quick ? 120 : 450)));
		timers.push(
			setTimeout(
				() => {
					phase = 'shown';
					const r = respond(s);
					const m = missionFor(r.code);
					if (m) done.add(m);
					if (done.size === ORDER.length && !finished) {
						finished = true;
						onstate?.('done');
						oncomplete?.();
					} else {
						onstate?.(r.token);
					}
				},
				t * 2 + (quick ? 120 : 450)
			)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="missions" aria-label={tx.missionsLabel}>
		<p class="cap">{tx.missionsLabel}</p>
		<ul>
			{#each ORDER as m (m)}
				<li class:ok={done.has(m)} class:cur={current === m}>
					<span class="dot" aria-hidden="true">
						{#if done.has(m)}
							<svg viewBox="0 0 16 16"
								><path
									d="M3.5 8.5l3 3 6-6.5"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						{/if}
					</span>
					<span>{tx.missions[m]}</span>
				</li>
			{/each}
		</ul>
	</div>

	<!-- the request builder, up top so the action sits clear of Nim -->
	<div class="builder">
		<div class="row">
			<span class="lab">{tx.methodLabel}</span>
			<div class="seg" role="radiogroup" aria-label={tx.methodLabel}>
				{#each METHODS as m (m)}
					<button
						type="button"
						role="radio"
						aria-checked={method === m}
						class:on={method === m}
						class={m.toLowerCase()}
						onclick={() => (method = m)}>{m}</button
					>
				{/each}
			</div>
		</div>
		<div class="row top">
			<span class="lab">{tx.pathLabel}</span>
			<div class="paths" role="radiogroup" aria-label={tx.pathLabel}>
				{#each PATHS as p (p)}
					<button
						type="button"
						role="radio"
						aria-checked={path === p}
						class="pchip"
						class:on={path === p}
						onclick={() => (path = p)}>{p}</button
					>
				{/each}
			</div>
		</div>
		<p class="phint">nimbus.com<b>{path}</b>, {tx.pathHints[path]}</p>
		{#if method === 'POST'}
			<label class="row">
				<span class="lab">{tx.bodyLabel}</span>
				<input class="msg" type="text" maxlength="40" bind:value={body} spellcheck="false" />
			</label>
		{/if}
		<button type="button" class="cta" onclick={send} disabled={busy}>
			{busy ? tx.sending : tx.send}
		</button>
	</div>

	<!-- the two actors and the wire between them -->
	<div class="scene">
		<div class="actor">
			<div class="phone" class:good={phase === 'shown' && tone === 'good'}>
				<div class="addr">
					<span class="led {phase === 'shown' ? tone : ''}"></span>
					<span class="url">nimbus.com{sent ? sent.path : ''}</span>
				</div>
				<div class="screen">
					{#if busy}
						<span class="spin" aria-hidden="true"></span>
					{:else if phase === 'shown' && res}
						<div class="shot {tone}">
							{#if res.screen === 'home'}
								<b>{tx.screen.home}</b>
								<i class="bar"></i><i class="bar s"></i>
							{:else if res.screen === 'about'}
								<b>{tx.screen.about}</b>
								<span>{tx.screen.aboutText}</span>
							{:else if res.screen === 'messages'}
								<b>{tx.screen.messages}</b>
								{#each (sent?.book ?? []).slice(-3) as m, i (i)}
									<span class="note">{m}</span>
								{/each}
							{:else if res.screen === 'created'}
								<span class="big">201</span>
								<span>{tx.screen.created}</span>
							{:else}
								<span class="big">{res.code}</span>
								<span>{tx.screen[res.screen]}</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
			<span class="alabel">{tx.youLabel}</span>
		</div>

		<div class="wire">
			<span class="line"></span>
			{#if sent && phase === 'going'}
				<span class="pkt go">{sent.method}</span>
			{/if}
			{#if res && phase === 'back'}
				<span class="pkt ret {tone}">{res.code}</span>
			{/if}
		</div>

		<div class="actor">
			<div
				class="srv"
				class:busy={phase === 'working'}
				class:down={phase === 'shown' && tone === 'bad'}
			>
				<Server active={phase === 'working' || (phase === 'shown' && tone !== 'bad')} />
			</div>
			<span class="alabel">{tx.serverLabel}</span>
		</div>
	</div>

	<!-- the raw conversation, exactly as it travels -->
	<div class="cards">
		<div class="card">
			<p class="ctitle">{tx.requestLabel}</p>
			<pre class="code">{reqText || ' '}</pre>
		</div>
		<div class="card">
			<p class="ctitle">
				{tx.responseLabel}
				{#if res && phase === 'shown'}
					<span class="status {tone}">{res.code} {res.reason}</span>
				{/if}
			</p>
			{#if res && phase === 'shown'}
				<pre class="code">{resText}</pre>
				<p class="snote {tone}">{note}</p>
			{:else}
				<p class="empty">{tx.waiting}</p>
			{/if}
		</div>
	</div>

	{#if done.size === ORDER.length}
		<p class="win" role="status">{tx.allDone}</p>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 620px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.cap {
		margin: 0 0 6px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.missions {
		width: 100%;
		max-width: 520px;
	}
	.missions ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.missions li {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		padding: 6px 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.3;
		transition:
			border-color 0.25s ease,
			background 0.25s ease,
			color 0.25s ease;
	}
	.missions li.cur {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.missions li.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.dot {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px solid currentColor;
	}
	.dot svg {
		width: 11px;
		height: 11px;
	}

	.builder {
		display: flex;
		width: 100%;
		max-width: 520px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px;
	}
	.row {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 10px;
	}
	.row.top {
		align-items: flex-start;
	}
	.row.top .lab {
		padding-top: 6px;
	}
	.lab {
		flex: none;
		width: 58px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.seg {
		display: inline-flex;
		border-radius: 10px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 2px;
	}
	.seg button {
		border-radius: 8px;
		padding: 5px 14px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-faint);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.on.get {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.seg button.on.post {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.paths {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		min-width: 0;
	}
	.pchip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 4px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}
	.pchip.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
		background: var(--color-card);
	}
	.phint {
		width: 100%;
		margin: 0;
		font-size: 11.5px;
		color: var(--color-faint);
		overflow-wrap: anywhere;
	}
	.phint b {
		color: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.msg {
		flex: 1;
		min-width: 0;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 5px 10px;
		font-size: 13px;
	}
	.msg:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: none;
	}
	.cta {
		margin-top: 2px;
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 22px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.14);
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.55;
	}

	.scene {
		display: flex;
		width: 100%;
		max-width: 420px;
		align-items: flex-start;
		gap: 6px;
	}
	.actor {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.phone {
		width: 128px;
		border-radius: 20px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
		transition: border-color 0.3s ease;
	}
	.phone.good {
		border-color: var(--color-grass);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 12px 12px 0 0;
		background: var(--color-card);
		border-bottom: 1px solid var(--color-line);
		padding: 4px 6px 6px;
	}
	.led {
		flex: none;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.good {
		background: var(--color-grass);
	}
	.led.warn {
		background: var(--color-amber);
	}
	.led.bad {
		background: var(--color-danger);
	}
	.url {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.screen {
		position: relative;
		display: flex;
		height: 104px;
		align-items: center;
		justify-content: center;
		border-radius: 0 0 13px 13px;
		background: var(--color-paper);
		padding: 6px;
		overflow: hidden;
	}
	.spin {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2.5px solid var(--color-line);
		border-top-color: var(--color-brand);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.shot {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		text-align: center;
		font-size: 9.5px;
		color: var(--color-muted);
		animation: rise 0.35s ease;
	}
	.shot b {
		font-size: 11px;
		color: var(--color-ink);
		line-height: 1.2;
	}
	.shot .bar {
		display: block;
		width: 80%;
		height: 6px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.shot .bar.s {
		width: 55%;
	}
	.shot .note {
		width: 100%;
		border-radius: 6px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 2px 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.shot .big {
		font-family: var(--font-display);
		font-size: 26px;
		line-height: 1;
		font-weight: 600;
	}
	.shot.good .big {
		color: var(--color-grass);
	}
	.shot.warn .big {
		color: var(--color-amber);
	}
	.shot.bad .big {
		color: var(--color-danger);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.wire {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 140px;
	}
	.wire .line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.pkt {
		position: absolute;
		top: 50%;
		border-radius: 7px;
		padding: 3px 7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 800;
		color: #fff;
		background: var(--color-brand);
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.18);
		transform: translate(-50%, -50%);
	}
	.pkt.go {
		animation: go 0.85s ease-in-out forwards;
	}
	.pkt.ret {
		animation: ret 0.85s ease-in-out forwards;
	}
	.pkt.good {
		background: var(--color-grass);
	}
	.pkt.warn {
		background: var(--color-amber);
	}
	.pkt.bad {
		background: var(--color-danger);
	}
	@keyframes go {
		from {
			left: 12%;
		}
		to {
			left: 88%;
		}
	}
	@keyframes ret {
		from {
			left: 88%;
		}
		to {
			left: 12%;
		}
	}
	.srv {
		padding-top: 22px;
		transition: transform 0.2s ease;
	}
	.srv :global(.server) {
		width: 70px;
		padding: 8px;
		gap: 6px;
		transition: border-color 0.3s ease;
	}
	.srv :global(.server .slot) {
		height: 12px;
	}
	.srv.busy {
		animation: hum 0.25s ease-in-out infinite;
	}
	.srv.busy :global(.server) {
		border-color: var(--color-brand);
	}
	.srv.down :global(.server) {
		border-color: var(--color-danger);
	}
	@keyframes hum {
		50% {
			transform: translateY(-1px);
		}
	}

	.cards {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr;
		gap: 8px;
	}
	.card {
		min-width: 0;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
	}
	.ctitle {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin: 0 0 6px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.status {
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 10.5px;
		letter-spacing: 0;
		text-transform: none;
	}
	.status.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.status.warn {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.status.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.code {
		margin: 0;
		min-height: 3.6em;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		line-height: 1.5;
		color: var(--color-ink);
	}
	.empty {
		margin: 0;
		min-height: 3.6em;
		font-size: 12px;
		color: var(--color-faint);
	}
	.snote {
		margin: 6px 0 0;
		font-size: 11.5px;
		font-weight: 600;
	}
	.snote.good {
		color: var(--color-grass);
	}
	.snote.warn {
		color: var(--color-amber);
	}
	.snote.bad {
		color: var(--color-danger);
	}
	.win {
		margin: 0;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
	}

	:global(.dark) .cta {
		box-shadow: none;
		color: var(--color-ink);
	}
	:global(.dark) .phone {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt.go,
		.pkt.ret,
		.shot {
			animation-duration: 0.01s;
		}
		.srv.busy,
		.spin {
			animation: none;
		}
		.missions li,
		.seg button,
		.pchip {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.cards {
			grid-template-columns: 1fr 1fr;
		}
		.lab {
			font-size: 12px;
			width: 64px;
		}
		.cta {
			font-size: 14px;
			padding: 11px 26px;
		}
	}
</style>
