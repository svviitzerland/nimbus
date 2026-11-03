<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { CtfChallengeId, CtfText } from '$lib/chapters/security/ctf/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CtfText);

	const ids: CtfChallengeId[] = ['caesar', 'source', 'password'];
	const flags: Record<CtfChallengeId, string> = {
		caesar: 'caesar',
		source: 'lookcloser',
		password: 'weakpass'
	};
	let active = $state<CtfChallengeId>('caesar');
	const solved = new SvelteSet<CtfChallengeId>();
	const score = $derived(solved.size * 100);
	let completed = false;

	// The flag box, shared by whichever challenge is open.
	let guess = $state('');
	let feedback = $state<'' | 'wrong' | 'right'>('');

	function open(id: CtfChallengeId) {
		active = id;
		guess = '';
		feedback = '';
		if (id === 'source' && !saidPeek) {
			saidPeek = true;
			onstate?.('peek');
		}
	}
	function submit(e?: SubmitEvent) {
		e?.preventDefault();
		if (solved.has(active)) return;
		// accept the bare word or the whole nimbus{word}
		const g = guess
			.trim()
			.toLowerCase()
			.replace(/^nimbus\{/, '')
			.replace(/\}$/, '');
		if (!g) return;
		if (g === flags[active]) {
			solved.add(active);
			feedback = 'right';
			if (solved.size === ids.length) {
				onstate?.('allFlags');
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			} else onstate?.(active);
		} else {
			feedback = 'wrong';
			onstate?.('wrongFlag');
		}
	}

	// Caesar. The flag nimbus{caesar} shifted forward by three.
	const cipher = 'qlpexv{fdhvdu}';
	let shift = $state(0);
	let saidDecoded = false;
	const plain = $derived(
		cipher.replace(/[a-z]/g, (c) =>
			String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97)
		)
	);
	function onShift() {
		if (shift === 3 && !saidDecoded) {
			saidDecoded = true;
			onstate?.('decoded');
		}
	}

	// Hidden comment. The page is rendered in a sandboxed frame, the source is plain text.
	let showSource = $state(false);
	let saidPeek = false;
	const source = $derived(
		[
			'<!doctype html>',
			'<html>',
			'  <body>',
			`    <h1>${tx.pageHeading}</h1>`,
			`    <p>${tx.pageBody}</p>`,
			'    <!-- todo, remove before launch',
			'         nimbus{lookcloser} -->',
			'  </body>',
			'</html>'
		].join('\n')
	);
	const srcdoc = $derived(
		'<!doctype html><html><head><meta charset="utf-8">' +
			`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">` +
			'<style>html{background:#fff;color:#16212b}body{margin:14px;font:14px/1.45 system-ui,sans-serif}h1{font-size:1.25em;margin:0 0 .4em}p{margin:0;color:#5e6b76}</style>' +
			`</head><body><h1>${esc(tx.pageHeading)}</h1><p>${esc(tx.pageBody)}</p>` +
			'<!-- nimbus{lookcloser} --></body></html>'
	);
	function esc(s: string) {
		return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	function toggleSource(v: boolean) {
		showSource = v;
	}

	// Weak password. Tap words from the list until one gets in.
	const wordlist = ['123456', 'password', 'qwerty', 'nimbus123', 'iloveyou', 'admin'];
	const correct = 'nimbus123';
	const triedPw = new SvelteSet<string>();
	let lastTry = $state('');
	let cracked = $state(false);
	let saidFail = false;
	function tryPassword(p: string) {
		if (cracked || triedPw.has(p)) return;
		triedPw.add(p);
		lastTry = p;
		if (p === correct) {
			cracked = true;
			onstate?.('cracked');
		} else if (!saidFail) {
			saidFail = true;
			onstate?.('tryFail');
		}
	}
</script>

<div class="wrap">
	<!-- the scoreboard and the three challenge tiles -->
	<div class="board">
		<p class="score">
			{tx.scoreLabel.replace('{n}', String(score)).replace('{total}', String(ids.length * 100))}
		</p>
		<div class="tiles">
			{#each ids as id (id)}
				<button
					type="button"
					class="tile"
					class:on={active === id}
					class:solved={solved.has(id)}
					aria-pressed={active === id}
					onclick={() => open(id)}
				>
					<span class="cat">{tx.challenges[id].category}</span>
					<span class="pts">
						{solved.has(id) ? `✓ ${tx.solvedTag}` : tx.points.replace('{n}', '100')}
					</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- the flag box, up top so it is never hidden behind Nim -->
	<form class="flag" class:right={solved.has(active)} onsubmit={submit}>
		<label for="ctf-flag" class="flabel">{tx.flagLabel}</label>
		<div class="frow">
			<span class="wrapper">nimbus{'{'}</span>
			<input
				id="ctf-flag"
				type="text"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				maxlength="24"
				placeholder={tx.flagPlaceholder}
				disabled={solved.has(active)}
				value={solved.has(active) ? flags[active] : guess}
				oninput={(e) => {
					guess = e.currentTarget.value;
					feedback = '';
				}}
			/>
			<span class="wrapper">}</span>
			<button type="submit" class="submit" disabled={solved.has(active) || !guess.trim()}>
				{tx.submitBtn}
			</button>
		</div>
		<p class="fnote" class:bad={feedback === 'wrong'} role="status">
			{#if solved.size === ids.length}
				{tx.allSolved}
			{:else if solved.has(active)}
				{tx.rightFlag}
			{:else if feedback === 'wrong'}
				{tx.wrongFlag}
			{:else}
				&nbsp;
			{/if}
		</p>
	</form>

	<!-- the open challenge -->
	<div class="card">
		<p class="cname">{tx.challenges[active].name}</p>
		<p class="brief">{tx.challenges[active].brief}</p>

		{#if active === 'caesar'}
			<div class="caesar">
				<p class="lbl">{tx.cipherLabel}</p>
				<p class="mono big">{cipher}</p>
				<p class="lbl">{tx.plainLabel}</p>
				<p class="mono big" class:hit={shift === 3}>{plain}</p>
				<label class="slider">
					<span>{tx.shiftLabel.replace('{n}', String(shift))}</span>
					<input type="range" min="0" max="25" bind:value={shift} oninput={onShift} />
				</label>
			</div>
		{:else if active === 'source'}
			<div class="seg" role="group">
				<button
					type="button"
					class:on={!showSource}
					aria-pressed={!showSource}
					onclick={() => toggleSource(false)}>{tx.viewPage}</button
				>
				<button
					type="button"
					class:on={showSource}
					aria-pressed={showSource}
					onclick={() => toggleSource(true)}>{tx.viewSource}</button
				>
			</div>
			<div class="frame">
				<div class="fbar"><span class="led"></span>nimbus.com</div>
				{#if showSource}
					<pre class="src">{source}</pre>
				{:else}
					<iframe title={tx.viewPage} sandbox="" {srcdoc}></iframe>
				{/if}
			</div>
		{:else}
			<div class="login">
				<div class="lhead">
					<span class="led" class:ok={cracked}></span>{tx.loginTitle}
				</div>
				<div class="lbody">
					{#if cracked}
						<p class="welcome pop">{tx.welcome}</p>
						<p class="mono big hit pop">nimbus{'{'}weakpass}</p>
					{:else}
						<p class="field"><span>{tx.userLabel}</span><b>admin</b></p>
						<p class="field">
							<span>Password</span>
							<b class="mono">{lastTry ? '•'.repeat(lastTry.length) : ''}</b>
						</p>
						{#if lastTry}
							{#key lastTry}
								<p class="wrong shake">{tx.wrongPass}</p>
							{/key}
						{/if}
					{/if}
				</div>
			</div>
			<p class="lbl">{tx.wordlistLabel}</p>
			<div class="words">
				{#each wordlist as w (w)}
					<button
						type="button"
						class="word mono"
						class:miss={triedPw.has(w) && w !== correct}
						class:hit={cracked && w === correct}
						disabled={cracked || triedPw.has(w)}
						onclick={() => tryPassword(w)}>{w}</button
					>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.board {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
	}
	.score {
		text-align: center;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.tiles {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 4px;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.tile.on {
		border-color: var(--color-brand);
	}
	.tile.solved {
		background: var(--color-grass-soft);
	}
	.cat {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.pts {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tile.solved .pts {
		color: var(--color-grass);
	}

	.flag {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px 6px;
	}
	.flag.right {
		border-color: var(--color-grass);
	}
	.flabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.frow {
		display: flex;
		align-items: center;
		gap: 3px;
		margin-top: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.wrapper {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	input[type='text'] {
		min-width: 0;
		flex: 1;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		padding: 6px 8px;
		font: inherit;
		font-size: 13px;
		color: var(--color-ink);
		outline: none;
	}
	input[type='text']:focus {
		border-color: var(--color-brand);
	}
	.submit {
		margin-left: 4px;
		border-radius: 9px;
		background: var(--btn-primary);
		padding: 7px 12px;
		font-family: inherit;
		font-size: 12.5px;
		font-weight: 700;
		color: #fff;
	}
	.submit:disabled {
		opacity: 0.45;
	}
	.fnote {
		min-height: 1.4em;
		margin-top: 3px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.fnote.bad {
		color: var(--color-danger);
	}

	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 12px 14px 14px;
	}
	.cname {
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.brief {
		margin-top: -4px;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.lbl {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.big {
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--color-ink);
		transition: color 0.2s;
	}
	.hit {
		color: var(--color-grass);
	}
	.caesar {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.slider {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.slider input {
		width: 100%;
		accent-color: var(--color-brand);
	}

	.seg {
		display: inline-flex;
		align-self: flex-start;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 2px;
	}
	.seg button {
		border-radius: 8px;
		padding: 5px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.seg button.on {
		background: var(--color-brand);
		color: #fff;
	}
	.frame {
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.fbar,
	.lhead {
		display: flex;
		align-items: center;
		gap: 6px;
		border-bottom: 1px solid var(--color-line);
		padding: 6px 10px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.fbar .led,
	.led.ok {
		background: var(--color-grass);
	}
	iframe {
		display: block;
		width: 100%;
		height: 132px;
		border: 0;
		background: #fff;
	}
	.src {
		height: 132px;
		margin: 0;
		overflow: auto;
		background: #10212f;
		padding: 10px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		line-height: 1.45;
		color: #d6e2ec;
		white-space: pre;
	}

	.login {
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.lbody {
		display: flex;
		min-height: 92px;
		flex-direction: column;
		justify-content: center;
		gap: 6px;
		padding: 10px 12px;
	}
	.field {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--color-faint);
	}
	.field span {
		width: 68px;
	}
	.field b {
		flex: 1;
		min-height: 24px;
		border-radius: 7px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 3px 8px;
		color: var(--color-ink);
	}
	.wrong {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-danger);
	}
	.welcome {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.words {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.word {
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 10px;
		font-size: 12.5px;
		color: var(--color-ink);
		transition: border-color 0.2s;
	}
	.word:enabled:hover {
		border-color: var(--color-brand);
	}
	.word.miss {
		color: var(--color-faint);
		text-decoration: line-through;
	}
	.word.hit {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pop {
		animation: pop 0.3s ease;
	}
	.shake {
		animation: shake 0.3s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop,
		.shake {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.brief {
			font-size: 13.5px;
		}
		.big {
			font-size: 20px;
		}
		iframe,
		.src {
			height: 150px;
		}
	}
</style>
