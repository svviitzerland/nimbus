<script lang="ts">
	import Server from '$lib/components/Server.svelte';
	import MiniPhone from './backend/MiniPhone.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AuthText } from '$lib/chapters/web/auth/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as AuthText);

	type Mode = 'session' | 'token';
	type Page = 'login' | 'orders' | 'kicked';

	let mode = $state<Mode>('session');
	let cookie = $state<string | null>(null);
	let sessions = $state<string[]>([]);
	let page = $state<Page>('login');
	let req = $state<{ line: string; cookie: string | null; status: number } | null>(null);
	let flash = $state(0);
	let loggedOnce = false;
	let completed = false;

	function rand(n: number) {
		const abc = '0123456789abcdef';
		let s = '';
		for (let i = 0; i < n; i++) s += abc[Math.floor(Math.random() * abc.length)];
		return s;
	}

	function setMode(m: Mode) {
		if (m === mode) return;
		mode = m;
		cookie = null;
		sessions = [];
		page = 'login';
		req = null;
	}

	function login() {
		if (mode === 'session') {
			const sid = rand(6);
			sessions = [...sessions, sid];
			cookie = `session=${sid}`;
		} else {
			cookie = `token=eyJ1c2VyIjoibmltIn0.${rand(5)}`;
		}
		req = { line: 'POST /login', cookie: null, status: 200 };
		flash++;
		page = 'orders';
		loggedOnce = true;
		onstate?.(mode === 'session' ? 'login' : 'token');
	}

	function valid(c: string | null) {
		if (!c) return false;
		if (c.startsWith('session=')) return sessions.includes(c.slice(8));
		return c.startsWith('token=');
	}

	function browse() {
		const ok = valid(cookie);
		req = { line: 'GET /orders', cookie, status: ok ? 200 : 401 };
		flash++;
		if (ok) {
			page = 'orders';
			onstate?.(mode === 'session' ? 'browse' : 'tokenBrowse');
		} else {
			page = loggedOnce ? 'kicked' : 'login';
			if (!loggedOnce) {
				onstate?.('stranger');
			} else {
				onstate?.(mode === 'session' ? 'kicked' : 'tokenKicked');
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
		}
	}

	function del() {
		cookie = null;
		onstate?.('deleted');
	}

	const led = $derived(
		page === 'orders' ? 'ok' : page === 'kicked' ? 'bad' : ('idle' as 'idle' | 'ok' | 'bad')
	);
</script>

<div class="wrap">
	<div class="seg" role="group">
		<button type="button" class:on={mode === 'session'} onclick={() => setMode('session')}
			>{tx.modeSession}</button
		>
		<button type="button" class:on={mode === 'token'} onclick={() => setMode('token')}
			>{tx.modeToken}</button
		>
	</div>

	<div class="acts">
		<button type="button" class="cta" onclick={login} disabled={cookie !== null}>{tx.login}</button>
		<button type="button" class="line" onclick={browse}>{tx.browse}</button>
		<button type="button" class="line warn" onclick={del} disabled={cookie === null}
			>{tx.deleteCookie}</button
		>
	</div>

	<div class="row">
		<div class="col">
			<MiniPhone
				{led}
				width={168}
				url={page === 'orders' ? 'nimbus.com/orders' : 'nimbus.com/login'}
			>
				{#if page === 'orders'}
					<b class="ptitle">{tx.page.hello}</b>
					{#each tx.page.orders as o (o)}
						<span class="orow">{o}<i>✓</i></span>
					{/each}
				{:else if page === 'kicked'}
					<b class="ptitle bad">{tx.page.kickedTitle}</b>
					<span class="hint">{tx.page.kickedHint}</span>
					<span class="field">{tx.page.email}</span>
					<span class="field">••••••••</span>
				{:else}
					<b class="ptitle">{tx.page.loginTitle}</b>
					<span class="field">{tx.page.email}</span>
					<span class="field">••••••••</span>
					<span class="hint">{tx.page.loginHint}</span>
				{/if}
			</MiniPhone>

			<div class="jar" class:full={cookie !== null}>
				<span class="jl">{tx.jarLabel}</span>
				{#if cookie}
					{#key cookie}
						<code class="ck">{cookie}</code>
					{/key}
					{#if mode === 'token'}
						<span class="inside">{tx.tokenInside}</span>
					{/if}
				{:else}
					<span class="empty">{tx.jarEmpty}</span>
				{/if}
			</div>
		</div>

		<div class="col">
			<div class="log">
				<span class="jl">{tx.logLabel}</span>
				{#if req}
					{#key flash}
						<div class="req">
							<code>{req.line}</code>
							<code class="cc" class:none={!req.cookie}>{req.cookie ?? tx.noCookie}</code>
							<span class="st" class:ok={req.status === 200}
								>{req.status === 200 ? '200 OK' : '401 Unauthorized'}</span
							>
						</div>
					{/key}
				{:else}
					<span class="empty">{tx.logIdle}</span>
				{/if}
			</div>

			<div class="srv">
				<div class="shead">
					<Server active={page === 'orders'} slots={2} />
					<b>{tx.serverLabel}</b>
				</div>
				{#if mode === 'session'}
					<span class="jl">{tx.sessionsLabel}</span>
					{#if sessions.length === 0}
						<span class="empty">{tx.sessionsEmpty}</span>
					{:else}
						{#each sessions as s (s)}
							<span class="sess"><code>{s}</code><span>{tx.sessionOwner}</span></span>
						{/each}
					{/if}
				{:else}
					<span class="tsrv">
						<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"
							><circle
								cx="8"
								cy="12"
								r="4"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							/><path
								d="M12 12h9M18 12v3M21 12v2"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/></svg
						>
						{tx.tokenServer}
					</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 480px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.seg {
		display: flex;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.seg button {
		border-radius: 9px;
		padding: 6px 14px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.on {
		background: var(--toggle-active);
		color: #fff;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.cta,
	.line {
		border-radius: 12px;
		padding: 9px 14px;
		font-size: 12.5px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			border-color 0.2s ease,
			opacity 0.2s ease;
	}
	.cta {
		background: var(--btn-primary);
		color: #fff;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	.line:enabled:hover {
		border-color: var(--color-ink);
	}
	.line.warn {
		color: var(--color-danger);
	}
	.line.warn:enabled:hover {
		border-color: var(--color-danger);
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		width: 100%;
	}
	.col {
		display: flex;
		flex: 1 1 190px;
		max-width: 240px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.ptitle {
		font-size: 11.5px;
	}
	.ptitle.bad {
		color: var(--color-danger);
	}
	.field {
		border-radius: 7px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 7px;
		font-size: 10px;
		color: var(--color-muted);
	}
	.hint {
		font-size: 10px;
		color: var(--color-faint);
	}
	.orow {
		display: flex;
		justify-content: space-between;
		border-radius: 7px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 5px 7px;
		font-size: 10.5px;
		font-weight: 600;
		animation: rise 0.3s ease;
	}
	.orow i {
		font-style: normal;
		color: var(--color-grass);
	}

	.jar,
	.log,
	.srv {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
	}
	.jar.full {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.jl {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.empty {
		font-size: 11px;
		color: var(--color-faint);
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		word-break: break-all;
	}
	.ck {
		font-weight: 700;
		color: var(--color-ink);
		animation: rise 0.3s ease;
	}
	.inside {
		font-size: 10px;
		line-height: 1.35;
		color: var(--color-muted);
	}
	.req {
		display: flex;
		flex-direction: column;
		gap: 3px;
		animation: rise 0.3s ease;
	}
	.cc {
		color: var(--color-amber);
	}
	.cc.none {
		color: var(--color-faint);
	}
	.st {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		padding: 2px 8px;
		font-size: 10px;
		font-weight: 800;
	}
	.st.ok {
		background: var(--color-grass);
	}
	.shead {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 2px;
	}
	.shead b {
		font-size: 12px;
	}
	.shead :global(.server) {
		width: 40px;
		padding: 5px;
		gap: 4px;
		border-radius: 8px;
		box-shadow: none;
	}
	.shead :global(.server .slot) {
		height: 8px;
	}
	.sess {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		border-radius: 7px;
		background: var(--color-paper);
		padding: 3px 7px;
		font-size: 10.5px;
		font-weight: 600;
		animation: rise 0.3s ease;
	}
	.tsrv {
		display: flex;
		align-items: flex-start;
		gap: 6px;
		font-size: 10.5px;
		line-height: 1.35;
		color: var(--color-muted);
	}
	.tsrv svg {
		flex: none;
		color: var(--color-brand);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.orow,
		.ck,
		.req,
		.sess {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 520px;
		}
		.cta,
		.line,
		.seg button {
			font-size: 13.5px;
		}
	}
</style>
