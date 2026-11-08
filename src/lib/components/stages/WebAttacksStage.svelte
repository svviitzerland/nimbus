<!--
	SQL injection and XSS, shown from the defender's side inside a pretend sandbox.
	The login never touches a real database, toySql.ts reads the query with plain string logic.
	The comment page is drawn in a sandboxed iframe (sandbox="", strict CSP), so nothing typed
	here can ever run. When a script would have run, the stage only shows a pretend popup.
-->
<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import { gluedLogin, paramLogin, type ToyResult } from './attacks2/toySql';
	import type { LessonText } from '$lib/chapters/types';
	import type { WebAttacksText } from '$lib/chapters/security/web-attacks/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WebAttacksText);

	let tab = $state<'login' | 'comments'>('login');
	let sqlBlocked = false;
	let xssBlocked = false;
	let completed = false;

	function check() {
		if (!completed && sqlBlocked && xssBlocked) {
			completed = true;
			oncomplete?.();
		}
	}

	// ---- Login ----
	let user = $state('nim');
	let pass = $state('cloud42');
	let paramFix = $state(false);
	let result = $state<ToyResult | null>(null);
	const sqlChips = ["admin' --", "' OR 1=1 --", "'; DROP TABLE users; --"];

	function split(v: string) {
		const q = v.indexOf("'");
		return q < 0 ? [v, ''] : [v.slice(0, q), v.slice(q)];
	}
	const userParts = $derived(split(user));
	const passParts = $derived(split(pass));
	const injected = $derived(!paramFix && (userParts[1] !== '' || passParts[1] !== ''));

	function login() {
		const attack = user.includes("'") || pass.includes("'");
		const r = paramFix ? paramLogin(user, pass) : gluedLogin(user, pass);
		result = r;
		if (paramFix) {
			if (r.kind === 'row') onstate?.('normal');
			else if (attack) {
				sqlBlocked = true;
				onstate?.('sqlBlocked');
				check();
			} else onstate?.('wrong');
			return;
		}
		if (r.kind === 'error') onstate?.('broken');
		else if (r.kind === 'drop') onstate?.('drop');
		else if (r.kind === 'row') onstate?.(attack ? 'sqlIn' : 'normal');
		else onstate?.('wrong');
	}
	function useChip(c: string) {
		user = c;
		pass = '';
		result = null;
	}
	function toggleParam() {
		paramFix = !paramFix;
		result = null;
	}

	// ---- Comments ----
	let draft = $state('');
	let escFix = $state(false);
	let posted = $state<string[]>([]);
	// The closing tag is split so the Svelte parser does not end this script block early.
	const xssChips = ['<b>Nimbus rocks</b>', '<script>steal(document.cookie)<' + '/script>'];
	const SCRIPTY = /<script\b|\bon\w+\s*=|javascript:/i;
	const TAGGY = /<\/?[a-z]/i;

	function esc(s: string) {
		return s
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}
	// Even unescaped, tags that could load or navigate are dropped. The iframe is sandboxed
	// with a strict CSP anyway, so nothing typed here can run or fetch anything.
	function tame(s: string) {
		return s.replace(/<\/?(meta|base|link|iframe|object|embed|form|frame|frameset)\b[^>]*>/gi, '');
	}
	const shown = (c: string) => (escFix ? esc(c) : tame(c));
	const lastSent = $derived(posted.length ? `<p>${escFix ? esc(posted[0]) : posted[0]}</p>` : '');
	const scriptLive = $derived(!escFix && posted.some((c) => SCRIPTY.test(c)));
	const srcdoc = $derived(
		'<!doctype html><html><head><meta charset="utf-8">' +
			`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">` +
			'<style>html{background:#fff;color:#16212b}body{margin:10px;font:13px/1.4 system-ui,sans-serif;overflow-wrap:anywhere}p{margin:0 0 7px;padding:6px 9px;border-radius:9px;background:#f3f1ec}</style>' +
			'</head><body>' +
			posted.map((c) => `<p>${shown(c)}</p>`).join('') +
			`<p>${esc(tx.comments.seed)}</p>` +
			'</body></html>'
	);

	function post() {
		const c = draft.trim();
		if (!c) return;
		posted = [c, ...posted].slice(0, 4);
		draft = '';
		if (escFix) {
			if (TAGGY.test(c)) {
				xssBlocked = true;
				onstate?.('xssBlocked');
				check();
			} else onstate?.('plain');
		} else if (SCRIPTY.test(c)) onstate?.('xssRan');
		else if (TAGGY.test(c)) onstate?.('htmlTag');
		else onstate?.('plain');
	}
	function toggleEsc() {
		escFix = !escFix;
		if (escFix && posted.some((c) => SCRIPTY.test(c))) {
			xssBlocked = true;
			onstate?.('xssBlocked');
			check();
		}
	}

	const fixOn = $derived(tab === 'login' ? paramFix : escFix);
	const fixLabel = $derived(tab === 'login' ? tx.login.fixLabel : tx.comments.fixLabel);
</script>

<div class="wrap">
	<div class="top">
		<div class="tabs" role="tablist">
			<button
				type="button"
				role="tab"
				aria-selected={tab === 'login'}
				class:on={tab === 'login'}
				onclick={() => (tab = 'login')}>{tx.tabs.login}</button
			>
			<button
				type="button"
				role="tab"
				aria-selected={tab === 'comments'}
				class:on={tab === 'comments'}
				onclick={() => (tab = 'comments')}>{tx.tabs.comments}</button
			>
		</div>
		<button
			type="button"
			class="switch"
			class:on={fixOn}
			role="switch"
			aria-checked={fixOn}
			onclick={tab === 'login' ? toggleParam : toggleEsc}
		>
			<span class="knob"></span>
			<span class="slabel">{fixLabel}</span>
			<span class="sstate">{fixOn ? tx.login.fixOn : tx.login.fixOff}</span>
		</button>
	</div>
	<p class="sandbox">{tx.sandboxTag}</p>

	{#if tab === 'login'}
		<div class="card">
			<div class="addr"><span class="led"></span>nimbus.com/login</div>
			<label class="field">
				<span>{tx.login.userLabel}</span>
				<input
					bind:value={user}
					maxlength="48"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
				/>
			</label>
			<label class="field">
				<span>{tx.login.passLabel}</span>
				<input
					bind:value={pass}
					maxlength="48"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
				/>
			</label>
			<div class="go">
				<CallToActionButton onclick={login}>
					{tx.login.submit}
				</CallToActionButton>
			</div>
			{#if result}
				{#key result}
					<p
						class="result pop"
						class:ok={result.kind === 'row'}
						class:bad={result.kind === 'none' || result.kind === 'error'}
						class:boom={result.kind === 'drop'}
						role="status"
					>
						{#if result.kind === 'row'}
							{tx.login.welcome.replace('{user}', result.row.name)}
						{:else if result.kind === 'none'}
							{tx.login.wrong}
						{:else if result.kind === 'error'}
							{tx.login.broken}
						{:else}
							DROP TABLE users
						{/if}
					</p>
				{/key}
			{/if}
		</div>

		<div class="chips">
			<span class="clabel">{tx.login.tryLabel}</span>
			{#each sqlChips as c (c)}
				<button type="button" class="chip" onclick={() => useChip(c)}>{c}</button>
			{/each}
		</div>

		<div class="code">
			<p class="cap">{tx.login.queryLabel}</p>
			{#if paramFix}
				<pre>SELECT * FROM users
WHERE name = <span class="slot">?</span> AND pass = <span class="slot">?</span></pre>
				<p class="cap">{tx.login.paramsLabel}</p>
				<div class="params">
					<span class="param"><b>name</b>{user}</span>
					<span class="param"><b>pass</b>{pass}</span>
				</div>
			{:else}
				<pre>SELECT * FROM users
WHERE name = '<span class="data">{userParts[0]}</span><span class="inj">{userParts[1]}</span
					>' AND pass = '<span class="data">{passParts[0]}</span><span class="inj"
						>{passParts[1]}</span
					>'</pre>
				{#if injected}<p class="injtag">{tx.login.codeTag}</p>{/if}
			{/if}
		</div>
	{:else}
		<div class="card">
			<label class="field">
				<span>{tx.comments.label}</span>
				<textarea
					bind:value={draft}
					rows="2"
					maxlength="120"
					placeholder={tx.comments.placeholder}
					spellcheck="false"
				></textarea>
			</label>
			<div class="go">
				<CallToActionButton onclick={post} disabled={!draft.trim()}>
					{tx.comments.post}
				</CallToActionButton>
			</div>
		</div>

		<div class="chips">
			<span class="clabel">{tx.comments.tryLabel}</span>
			{#each xssChips as c (c)}
				<button type="button" class="chip" onclick={() => (draft = c)}>{c}</button>
			{/each}
		</div>

		{#if lastSent}
			<div class="code">
				<p class="cap">{tx.comments.sentLabel}</p>
				<pre class:safe={escFix}>{lastSent}</pre>
			</div>
		{/if}

		<div class="page">
			<p class="cap">{tx.comments.pageLabel}</p>
			<div class="frame">
				<iframe title={tx.comments.pageLabel} sandbox="" {srcdoc}></iframe>
				{#if scriptLive}
					<div class="popup pop" role="alert">
						<b>{tx.comments.ranTitle}</b>
						<span>{tx.comments.ranBody}</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 380px);
		max-height: 100%;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.tabs {
		display: inline-flex;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 2px;
	}
	.tabs button {
		border-radius: 8px;
		padding: 5px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px 4px 4px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		transition: border-color 0.2s;
	}
	.knob {
		position: relative;
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s;
	}
	.switch.on {
		border-color: var(--color-grass);
	}
	.switch.on .knob {
		background: var(--color-grass);
	}
	.switch.on .knob::after {
		transform: translateX(12px);
	}
	.sstate {
		font-size: 10px;
		color: var(--color-faint);
	}
	.switch.on .sstate {
		color: var(--color-grass);
	}
	.sandbox {
		text-align: center;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 7px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 8px;
		background: var(--color-paper);
		padding: 4px 9px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.field span {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.field input,
	.field textarea {
		width: 100%;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 6px 9px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		resize: none;
	}
	.field input:focus,
	.field textarea:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: none;
	}
	.go {
		display: flex;
		justify-content: center;
	}
	.go :global(.cta) {
		padding: 8px 18px;
		font-size: 13px;
	}
	.result {
		border-radius: 9px;
		padding: 6px 10px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 700;
	}
	.result.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.result.bad {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.result.boom {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
	}
	.clabel {
		width: 100%;
		text-align: center;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.chip {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-radius: 999px;
		border: 1px solid var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
		padding: 3px 9px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
	}
	.code,
	.page {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	pre {
		margin: 0;
		border-radius: 10px;
		background: #16212b;
		color: #e0dcd4;
		padding: 8px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		line-height: 1.5;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	pre.safe {
		color: #9fd8b5;
	}
	.data {
		color: #8fb8f5;
	}
	.inj {
		border-radius: 3px;
		background: rgba(211, 88, 74, 0.35);
		color: #ffb3a8;
	}
	.slot {
		color: #9fd8b5;
		font-weight: 700;
	}
	.injtag {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 800;
	}
	.params {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.param {
		display: inline-flex;
		max-width: 100%;
		gap: 6px;
		border-radius: 8px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		padding: 3px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
	.param b {
		color: var(--color-faint);
	}
	.frame {
		position: relative;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--color-line);
	}
	iframe {
		display: block;
		width: 100%;
		height: 150px;
		border: 0;
		background: #fff;
	}
	.popup {
		position: absolute;
		left: 10%;
		right: 10%;
		top: 18px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		border-radius: 10px;
		border: 1px solid var(--color-danger);
		background: var(--color-card);
		padding: 8px 11px;
		font-size: 11.5px;
		color: var(--color-ink);
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.18);
	}
	.popup b {
		color: var(--color-danger);
		font-size: 11px;
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.94);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
		.knob,
		.knob::after {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 10px;
		}
		pre {
			font-size: 12.5px;
		}
		iframe {
			height: 170px;
		}
	}
</style>
