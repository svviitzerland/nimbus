<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { A11yText, A11yMissionId, A11yFixId } from '$lib/chapters/web/a11y/types';
	import Missions from './frontend/Missions.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as A11yText);

	// ---- The page, read in this order ----
	type Piece = 'logo' | 'heading' | 'tagline' | 'email' | 'subscribe' | 'end';
	const PIECES: Piece[] = ['logo', 'heading', 'tagline', 'email', 'subscribe', 'end'];
	const FIX_OF: Partial<Record<Piece, A11yFixId>> = {
		logo: 'alt',
		email: 'label',
		subscribe: 'button'
	};

	let blind = $state(false);
	let cursor = $state(-1);
	let voice = $state(false);
	let fixed = $state<Record<A11yFixId, boolean>>({ alt: false, label: false, button: false });
	const piece = $derived<Piece | null>(cursor >= 0 ? PIECES[cursor] : null);
	const broken = $derived<A11yFixId | null>(
		piece && FIX_OF[piece] && !fixed[FIX_OF[piece]!] ? FIX_OF[piece]! : null
	);
	const fixHere = $derived<A11yFixId | null>(piece ? (FIX_OF[piece] ?? null) : null);

	function lineFor(p: Piece): string {
		const r = tx.roles;
		switch (p) {
			case 'logo':
				return fixed.alt ? `${r.image}, ${tx.page.alt}` : `${r.image}, IMG_2041.png`;
			case 'heading':
				return `${r.heading}, ${tx.page.heading}`;
			case 'tagline':
				return tx.page.tagline;
			case 'email':
				return fixed.label ? `${tx.page.email}, ${r.editText}` : `${r.editText}, ${tx.blank}`;
			case 'subscribe':
				return fixed.button ? `${tx.page.subscribe}, ${r.button}` : tx.skipped;
			default:
				return tx.endOfPage;
		}
	}
	const line = $derived(piece ? lineFor(piece) : '');
	const silent = $derived(piece === 'subscribe' && !fixed.button);

	// ---- Optional voice, only ever started from a tap ----
	function speak(s: string) {
		if (!voice || typeof speechSynthesis === 'undefined') return;
		speechSynthesis.cancel();
		if (s.startsWith('(')) return;
		const u = new SpeechSynthesisUtterance(s);
		u.lang = tx.voiceLang;
		u.rate = 1.05;
		speechSynthesis.speak(u);
	}
	function toggleVoice() {
		voice = !voice;
		if (voice && piece) speak(lineFor(piece));
		else if (!voice && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
	}
	onDestroy(() => {
		if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
	});

	function next() {
		cursor = (cursor + 1) % PIECES.length;
		speak(lineFor(PIECES[cursor]));
	}
	function restart() {
		cursor = 0;
		speak(lineFor(PIECES[0]));
	}
	let blindSaid = false;
	function toggleBlind() {
		blind = !blind;
		if (blind && !blindSaid) {
			blindSaid = true;
			onstate?.('blind');
		}
	}

	// ---- Missions ----
	const ORDER: A11yMissionId[] = ['alt', 'label', 'button', 'contrast'];
	let gray = $state(200);
	function lin(c: number) {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
	}
	const ratio = $derived(1.05 / (lin(gray) + 0.05));
	const ratioText = $derived(
		tx.ratio.replace(
			'{n}',
			(Math.floor(ratio * 10) / 10).toLocaleString(tx.voiceLang, {
				minimumFractionDigits: 1,
				maximumFractionDigits: 1
			})
		)
	);
	const done = $derived<Record<A11yMissionId, boolean>>({
		alt: fixed.alt,
		label: fixed.label,
		button: fixed.button,
		contrast: ratio >= 4.5
	});
	const allDone = $derived(ORDER.every((m) => done[m]));
	const reported: Record<string, boolean> = {};
	let finished = false;
	$effect(() => {
		const d = done;
		const fresh = ORDER.filter((m) => d[m] && !reported[m]);
		if (!fresh.length) return;
		fresh.forEach((m) => (reported[m] = true));
		if (ORDER.every((m) => d[m]) && !finished) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
		} else onstate?.(fresh[fresh.length - 1]);
	});

	function fix(id: A11yFixId) {
		fixed[id] = true;
		if (piece) speak(lineFor(piece));
	}
	function onSlide(e: Event) {
		gray = 220 - Number((e.currentTarget as HTMLInputElement).value);
	}

	const CODE: Record<A11yFixId, { before: string; after: (t: A11yText) => string }> = {
		alt: {
			before: '<img src="IMG_2041.png">',
			after: (t) => `<img src="IMG_2041.png" alt="${t.page.alt}">`
		},
		label: {
			before: '<input type="email">',
			after: (t) => `<label>${t.page.email} <input type="email"></label>`
		},
		button: {
			before: '<div class="go" onclick="join()"><svg>...</svg></div>',
			after: (t) => `<button onclick="join()">${t.page.subscribe}</button>`
		}
	};
	const at = (p: Piece) => piece === p;
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		items={ORDER.map((m) => ({ id: m, text: tx.missions[m], done: done[m] }))}
	/>

	<div class="controls">
		<button
			type="button"
			class="toggle"
			class:on={blind}
			aria-pressed={blind}
			onclick={toggleBlind}
		>
			<svg viewBox="0 0 24 24" aria-hidden="true"
				>{#if blind}<path
						d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.2M6.5 7.6C4.3 9.2 3 12 3 12s4 6 9 6a9 9 0 0 0 3.6-.8"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/>{:else}<path
						d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					/><circle cx="12" cy="12" r="2.6" fill="currentColor" />{/if}</svg
			>
			{tx.blindfold}
		</button>
		<button type="button" class="go" onclick={next}>
			{tx.next}
			<svg viewBox="0 0 12 12" aria-hidden="true"
				><path
					d="M2 6h7M6 3l3 3-3 3"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
		</button>
		{#if cursor > 0}
			<button type="button" class="ghost" onclick={restart}>{tx.restart}</button>
		{/if}
		<button type="button" class="ghost" class:on={voice} aria-pressed={voice} onclick={toggleVoice}
			>{tx.voice}</button
		>
	</div>

	<div class="work">
		<!-- The signup page (a picture of it, not something you can use here) -->
		<div class="pane">
			<div class="addr">
				<span class="led" class:on={allDone}></span>
				<span class="url">nimbus.com/join</span>
			</div>
			<div class="pagebox">
				<div class="page" inert>
					<div class="pc" class:cur={at('logo')}>
						<svg class="logo" viewBox="0 0 120 80" aria-hidden="true"
							><path
								d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z"
								fill="#2e6fe0"
							/><circle cx="50" cy="44" r="5" fill="#fff" /><circle
								cx="72"
								cy="44"
								r="5"
								fill="#fff"
							/><circle cx="51" cy="45" r="2.4" fill="#16212b" /><circle
								cx="73"
								cy="45"
								r="2.4"
								fill="#16212b"
							/></svg
						>
					</div>
					<h3 class="pc h" class:cur={at('heading')}>{tx.page.heading}</h3>
					<p class="pc tag" class:cur={at('tagline')} style:color="rgb({gray},{gray},{gray})">
						{tx.page.tagline}
					</p>
					<div class="row">
						<div class="pc field" class:cur={at('email')}>
							{#if fixed.label}<span class="lbl">{tx.page.email}</span>{/if}
							<span class="input"></span>
						</div>
						<div class="pc" class:cur={at('subscribe')}>
							{#if fixed.button}
								<span class="realbtn">{tx.page.subscribe}</span>
							{:else}
								<span class="fakebtn"
									><svg viewBox="0 0 12 12"
										><path
											d="M2 6h7M6 3l3 3-3 3"
											fill="none"
											stroke="currentColor"
											stroke-width="1.8"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									></span
								>
							{/if}
						</div>
					</div>
				</div>
				{#if blind}
					<div class="cover">
						<span>{tx.cover}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- What the screen reader says, and the fix for the current piece -->
		<div class="side">
			<div class="reader" aria-live="polite">
				<p class="cap">{tx.readerLabel}</p>
				{#if piece}
					<p class="say" class:silent class:bad={!!broken}>{silent ? line : `"${line}"`}</p>
				{:else}
					<p class="say idle">{tx.readerIdle}</p>
				{/if}
			</div>

			{#if fixHere}
				<div class="fix" class:ok={!broken}>
					<pre class="code before" class:gone={!broken}>{CODE[fixHere].before}</pre>
					{#if broken}
						<button type="button" class="fixbtn" onclick={() => fix(fixHere)}>
							{tx.fixLabel}
							<span>{tx.fixes[fixHere]}</span>
						</button>
					{:else}
						<pre class="code after">{CODE[fixHere].after(tx)}</pre>
					{/if}
				</div>
			{/if}

			<div class="contrast" class:ok={done.contrast}>
				<div class="crow">
					<span>{tx.contrastLabel}</span>
					<b>{ratioText}</b>
				</div>
				<input
					type="range"
					min="0"
					max="190"
					value={220 - gray}
					oninput={onSlide}
					aria-label={tx.darker}
				/>
				<div class="crow small">
					<span>{tx.darker}</span>
					<span>{tx.need}</span>
				</div>
			</div>
		</div>
	</div>

	{#if allDone}
		<p class="win" role="status">{tx.allDone}</p>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 720px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.controls button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 12.5px;
		font-weight: 600;
		transition:
			transform 0.15s ease,
			background 0.2s ease,
			border-color 0.2s ease;
	}
	.controls button:active {
		transform: scale(0.96);
	}
	.controls svg {
		width: 15px;
		height: 15px;
	}
	.toggle.on {
		background: var(--color-ink);
		border-color: var(--color-ink);
		color: var(--color-paper);
	}
	.go {
		border-color: var(--color-brand) !important;
		background: var(--color-brand) !important;
		color: #fff !important;
	}
	.go svg {
		width: 12px;
		height: 12px;
	}
	.ghost {
		color: var(--color-muted) !important;
	}
	.ghost.on {
		border-color: var(--color-brand) !important;
		color: var(--color-brand) !important;
		background: var(--color-brand-soft) !important;
	}

	.work {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		width: 100%;
		max-width: 420px;
	}
	@media (min-width: 720px) {
		.work {
			grid-template-columns: 1fr 1fr;
			max-width: 720px;
		}
	}
	.pane {
		min-width: 0;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-muted);
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		flex: 1;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}

	/* The page keeps its own light colors, the contrast numbers are measured against white. */
	.pagebox {
		position: relative;
	}
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 14px 14px 16px;
		background: #fff;
		color: #16212b;
		text-align: center;
	}
	.pc {
		border-radius: 8px;
		padding: 2px 6px;
		outline: 2.5px solid transparent;
		outline-offset: 1px;
		transition: outline-color 0.2s ease;
	}
	.pc.cur {
		outline-color: #2e6fe0;
	}
	.logo {
		display: block;
		width: 64px;
		height: 42px;
	}
	.h {
		margin: 0;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.25;
	}
	.tag {
		margin: 0;
		font-size: 12.5px;
	}
	.row {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		width: 100%;
		max-width: 280px;
		margin-top: 4px;
	}
	.field {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
	}
	.lbl {
		font-size: 11.5px;
		font-weight: 600;
		color: #16212b;
	}
	.input {
		display: block;
		width: 100%;
		height: 30px;
		border-radius: 8px;
		border: 1px solid #b9b3a9;
		background: #fff;
	}
	.fakebtn {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #2e6fe0;
		color: #fff;
	}
	.fakebtn svg {
		width: 13px;
		height: 13px;
	}
	.realbtn {
		display: inline-block;
		padding: 6px 12px;
		border-radius: 8px;
		background: #2e6fe0;
		color: #fff;
		font-size: 12.5px;
		font-weight: 600;
	}
	.cover {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 16px;
		background: #0d141c;
		color: #97a3ae;
		font-size: 12.5px;
		text-align: center;
	}

	/* ---- Reader, fix, contrast ---- */
	.side {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.reader {
		padding: 9px 12px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.cap {
		margin: 0 0 4px;
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.say {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.say.bad {
		color: var(--color-danger);
	}
	.say.silent {
		font-style: italic;
		font-weight: 500;
	}
	.say.idle {
		font-weight: 500;
		color: var(--color-muted);
		font-size: 12.5px;
	}
	.fix {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.code {
		margin: 0;
		padding: 6px 10px;
		border-radius: 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.code.before {
		background: var(--color-danger-soft);
		color: var(--color-ink);
	}
	.code.before.gone {
		text-decoration: line-through;
		color: var(--color-faint);
	}
	.code.after {
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-weight: 600;
	}
	.fixbtn {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1px;
		padding: 7px 12px;
		border-radius: 10px;
		background: var(--color-grass);
		color: #fff;
		font-size: 13px;
		font-weight: 700;
		text-align: left;
		transition: transform 0.15s ease;
	}
	.fixbtn:active {
		transform: scale(0.97);
	}
	.fixbtn span {
		font-size: 11.5px;
		font-weight: 500;
		opacity: 0.9;
	}
	.contrast {
		padding: 8px 12px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		transition: border-color 0.2s ease;
	}
	.contrast.ok {
		border-color: var(--color-grass);
	}
	.crow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.crow b {
		color: var(--color-danger);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.contrast.ok .crow b {
		color: var(--color-grass);
	}
	.crow.small {
		font-size: 11px;
		color: var(--color-faint);
	}
	.contrast input {
		width: 100%;
		accent-color: var(--color-brand);
	}

	.win {
		margin: 0;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 12.5px;
		font-weight: 700;
	}

	@media (prefers-reduced-motion: reduce) {
		.controls button,
		.pc,
		.fixbtn,
		.contrast {
			transition: none;
		}
	}
</style>
