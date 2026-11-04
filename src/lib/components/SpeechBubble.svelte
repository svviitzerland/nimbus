<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Nim from './Nim.svelte';
	import { t, lang } from '$lib/i18n';
	import { renderTerms, resolveTerm, type ResolvedTerm } from '$lib/terms';
	import { path } from '$lib/path.svelte';
	import { progress } from '$lib/progress.svelte';
	import type { LessonRef } from '$lib/tracks';
	import type { Mood } from '$lib/chapters/types';

	let {
		nim,
		lines = [],
		mood = 'calm',
		canNext = false,
		canBack = false,
		final = false,
		aside = false,
		onnext,
		onback,
		onjump,
		step = 0,
		steps = 0
	}: {
		nim: string;
		/**
		 * Every line this lesson can show (beats and reactions). The dock reserves room for the
		 * longest one, so its height stays the same for the whole lesson and the stage above it
		 * never jumps when a line is longer or shorter.
		 */
		lines?: string[];
		mood?: Mood;
		canNext?: boolean;
		canBack?: boolean;
		final?: boolean;
		aside?: boolean;
		onnext?: () => void;
		onback?: () => void;
		/** Jump to another lesson from a cross link chip. Without it, lesson chips cannot jump. */
		onjump?: (ref: LessonRef) => void;
		/** Current beat and beat count, drawn as small progress dots in the dock. */
		step?: number;
		steps?: number;
	} = $props();

	// Any line (a beat or a reaction) that starts with `[fyi]` is a "by the way" aside, and
	// `[ingat]` marks a memory trick. Both lead with a small tag and tint the bubble a little.
	const FYI_MARK = '[fyi]';
	const MEMO_MARK = '[ingat]';
	function parse(line: string) {
		const s = line.trimStart();
		const low = s.toLowerCase();
		if (low.startsWith(FYI_MARK))
			return { kind: 'fyi' as const, body: s.slice(FYI_MARK.length).trimStart() };
		if (low.startsWith(MEMO_MARK))
			return { kind: 'memo' as const, body: s.slice(MEMO_MARK.length).trimStart() };
		return { kind: 'plain' as const, body: line };
	}
	const cur = $derived(parse(nim));
	const isFyi = $derived(cur.kind === 'fyi');
	const isMemo = $derived(cur.kind === 'memo');
	const html = $derived(renderTerms(cur.body, $lang));
	// invisible copies of every line, stacked in one grid cell, give the dock its fixed height
	const sizers = $derived(
		[...new Set([...lines, nim])].map((l) => {
			const p = parse(l);
			return { kind: p.kind, html: renderTerms(p.body, $lang) };
		})
	);

	// The dock can fold down to a slim bar (Nim, one line, and Next) to give the stage more room.
	let collapsed = $state(false);
	function toggle() {
		collapsed = !collapsed;
	}

	// Nim speaks a line word by word, and the mouth moves while the words come in. A tap on the
	// line shows it all at once. The words are only faded in, so the layout never moves.
	const WORD_MS = 24;
	let talking = $state(false);
	let revealAll = $state(false);
	let reduced = $state(false);
	onMount(() => {
		reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
	});
	function speak(node: HTMLElement) {
		revealAll = false;
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const texts: Text[] = [];
		while (walker.nextNode()) {
			const n = walker.currentNode as Text;
			if (!n.parentElement?.closest('.fyi-tag, .memo-tag')) texts.push(n);
		}
		let i = 0;
		for (const tn of texts) {
			const frag = document.createDocumentFragment();
			for (const part of tn.data.split(/(\s+)/)) {
				if (!part) continue;
				if (/^\s+$/.test(part)) {
					frag.append(part);
					continue;
				}
				const w = document.createElement('span');
				w.className = 'w';
				w.style.setProperty('--i', String(i++));
				w.textContent = part;
				frag.append(w);
			}
			tn.replaceWith(frag);
		}
		talking = !reduced;
		const timer = setTimeout(() => (talking = false), i * WORD_MS + 260);
		return {
			destroy() {
				clearTimeout(timer);
			}
		};
	}
	// when a long line does not fit, a soft fade at the bottom says there is more to scroll
	let stackEl: HTMLDivElement | undefined = $state();
	let more = $state(false);
	function measure() {
		if (!stackEl) return;
		more = stackEl.scrollHeight - stackEl.scrollTop - stackEl.clientHeight > 4;
	}
	$effect(() => {
		void nim;
		void collapsed;
		if (stackEl) stackEl.scrollTop = 0;
		requestAnimationFrame(measure);
	});
	function showAll() {
		revealAll = true;
		talking = false;
	}

	let nimSmall: Nim | undefined = $state();
	let nimLarge: Nim | undefined = $state();
	function pokeNim() {
		nimSmall?.poke();
		nimLarge?.poke();
	}

	// Inline glossary chips: [[term|topic]] becomes a tappable chip (rendered inside {@html} so it
	// composes with any existing markup), and a tap opens a small "coming soon" card for that module.
	let activeTerm = $state<{ label: string; target: string } | null>(null);
	const term = $derived<ResolvedTerm | null>(
		activeTerm ? resolveTerm(activeTerm.target, $lang) : null
	);
	$effect(() => {
		void nim; // a new line (beat or reaction) clears any open card
		activeTerm = null;
	});
	function termClicks(node: HTMLElement) {
		const onClick = (e: Event) => {
			const btn = (e.target as HTMLElement).closest('button.term') as HTMLElement | null;
			if (!btn || !node.contains(btn)) {
				showAll();
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			activeTerm = {
				label: btn.dataset.label ?? btn.textContent ?? '',
				target: btn.dataset.target ?? 'general'
			};
		};
		node.addEventListener('click', onClick);
		return { destroy: () => node.removeEventListener('click', onClick) };
	}
	function onTermKey(e: KeyboardEvent) {
		if (e.key === 'Escape') activeTerm = null;
	}
</script>

{#snippet tag(kind: 'fyi' | 'memo' | 'plain')}
	{#if kind === 'fyi'}<span class="fyi-tag"
			><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
				><path d="M12 1.6l1.7 8.7 8.7 1.7-8.7 1.7L12 22.4l-1.7-8.7L1.6 12l8.7-1.7z" /></svg
			>FYI</span
		>{:else if kind === 'memo'}<span class="memo-tag"
			><svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
				><path
					d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"
				/></svg
			>{$t.memoTag}</span
		>{/if}
{/snippet}

<svelte:window onkeydown={onTermKey} />

<div class="dock-wrap">
	<!-- The dialogue dock. It sits in the page flow under the stage (never on top of it), like the
	     dialogue box in a game. Nim stands on the left, the speech bubble points at Nim, and the
	     controls sit inside the bubble. Its height is fixed for the whole lesson. -->
	<section
		class="dock"
		class:collapsed
		class:turn={aside}
		class:fyi={isFyi}
		class:memo={isMemo}
		aria-label="Nim"
	>
		<button
			type="button"
			class="avatar"
			onclick={pokeNim}
			aria-label="Nim"
			style="view-transition-name: nim;"
		>
			<span class="block md:hidden"
				><Nim bind:this={nimSmall} {mood} {talking} size={collapsed ? 32 : 42} /></span
			>
			<span class="hidden md:block"
				><Nim bind:this={nimLarge} {mood} {talking} size={collapsed ? 46 : 104} /></span
			>
		</button>

		<div class="bubble">
			<span class="tail" aria-hidden="true"></span>
			<div class="line">
				<div class="meta">
					<span class="who">Nim</span>
					{#if steps > 1 && !collapsed}
						<span class="dots" aria-hidden="true">
							{#each Array.from({ length: steps }, (_, k) => k) as k (k)}
								<i class:on={k === step} class:past={k < step}></i>
							{/each}
						</span>
						<span class="count">{step + 1}/{steps}</span>
					{/if}
					{#if !canNext && !collapsed}
						<span class="hint">{$t.completeHint}</span>
					{/if}
				</div>
				{#if collapsed}
					<p class="text clamp">{@render tag(cur.kind)}{@html html}</p>
				{:else}
					<div class="stack" class:more bind:this={stackEl} onscroll={measure}>
						{#each sizers as s, k (k)}
							<p class="text sizer" aria-hidden="true" inert>{@render tag(s.kind)}{@html s.html}</p>
						{/each}
						{#key nim}
							<p
								use:termClicks
								use:speak
								class="text live"
								class:all={revealAll || reduced}
								aria-live="polite"
							>
								{@render tag(cur.kind)}{@html html}
							</p>
						{/key}
					</div>
				{/if}
			</div>

			<div class="controls">
				{#if canBack && !collapsed}
					<button onclick={onback} class="back">{$t.back}</button>
				{/if}
				<button
					onclick={onnext}
					disabled={!canNext}
					class="next"
					title={canNext ? undefined : $t.completeHint}
				>
					<span>{final ? $t.finish : $t.next}</span>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d={final ? 'M5 12.5l4.5 4.5L19 7.5' : 'M9 5l7 7-7 7'}
							stroke="currentColor"
							stroke-width="2.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<button
					type="button"
					onclick={toggle}
					aria-label={collapsed ? $t.showNim : $t.hideNim}
					aria-expanded={!collapsed}
					class="fold"
				>
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path
							d={collapsed ? 'M3 8.5l4-4 4 4' : 'M3 5.5l4 4 4-4'}
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	</section>

	<!-- Cross link card for a tapped [[label|target]] chip. It says where the idea is taught. A
	     shipped lesson can be jumped to right now (Nim brings the learner back afterwards); a
	     planned one just says which track will cover it. -->
	{#if activeTerm && term}
		{@const tc = term.color}
		{@const jumpable = term.kind === 'lesson' && !!onjump}
		{@const isDone =
			term.kind === 'lesson' && progress.isDone(term.ref.chapterId, term.ref.lessonId)}
		{@const later = term.kind === 'lesson' && !isDone && path.includes(term.ref)}
		<div class="term-modal" transition:fade={{ duration: 140 }}>
			<button class="term-backdrop" aria-label={$t.termClose} onclick={() => (activeTerm = null)}
			></button>
			<div
				class="term-card"
				role="dialog"
				aria-modal="true"
				transition:fly={{ y: 14, duration: 220, easing: cubicOut }}
			>
				<span class="term-soon" style="--tc:{tc}">
					<span class="dot" class:still={term.kind === 'lesson'}></span>
					{term.kind === 'lesson'
						? term.track
							? $t.termTrack.replace('{name}', term.track.title[$lang])
							: $t.termReady
						: $t.termSoon}
				</span>
				<p class="term-word" style="--tc:{tc}">{activeTerm.label}</p>
				<p class="term-body">
					{#if term.kind === 'lesson'}
						{$t.termLesson.replace('{title}', term.title)}
					{:else if term.kind === 'soon'}
						{$t.termSoonLesson.replace('{title}', term.title).replace('{name}', term.where)}
					{:else if term.kind === 'track'}
						{$t.termModule.replace('{name}', term.track.title[$lang])}
					{:else}
						{$t.termModule.replace('{name}', term.name)}
					{/if}
				</p>
				<p class="term-note">
					{term.kind !== 'lesson'
						? $t.termSub
						: isDone
							? $t.termDone
							: later
								? $t.termLater
								: $t.termJumpNote}
				</p>
				{#if jumpable && term.kind === 'lesson'}
					<button
						class="term-ok"
						style="background:{tc}"
						onclick={() => {
							const ref = term.ref;
							activeTerm = null;
							onjump?.(ref);
						}}>{isDone ? $t.termReview : $t.termJump}</button
					>
					<button class="term-later" onclick={() => (activeTerm = null)}>{$t.termStay}</button>
				{:else}
					<button class="term-ok" onclick={() => (activeTerm = null)}>{$t.termClose}</button>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.dock-wrap {
		display: flex;
		width: 100%;
		justify-content: center;
	}
	.dock {
		--accent: var(--color-brand);
		position: relative;
		display: grid;
		width: min(100%, 960px);
		grid-template-columns: auto minmax(0, 1fr);
		align-items: end;
		gap: 0 14px;
	}
	.dock.fyi {
		--accent: var(--color-amber);
	}
	.dock.memo {
		--accent: var(--color-grass);
	}
	.avatar {
		position: relative;
		align-self: end;
		margin-bottom: 2px;
		outline: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.bubble {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 4px 18px;
		border: 1px solid var(--color-line);
		border-radius: 22px;
		background: var(--color-card);
		padding: 12px 14px 14px 20px;
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--color-line) 60%, transparent),
			0 14px 34px rgba(22, 40, 60, 0.1);
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	/* a soft accent stripe on the left edge, amber for FYI, green for a memory trick */
	.bubble::before {
		content: '';
		position: absolute;
		left: -1px;
		top: 16px;
		bottom: 16px;
		width: 3px;
		border-radius: 0 3px 3px 0;
		background: var(--accent);
		opacity: 0.85;
		transition: background 0.3s;
	}
	.dock.turn .bubble {
		border-color: color-mix(in srgb, var(--color-brand) 35%, var(--color-line));
	}
	/* the bubble's tail, pointing down and left at Nim */
	.tail {
		position: absolute;
		left: -8px;
		bottom: 26px;
		height: 16px;
		width: 16px;
		transform: rotate(45deg);
		border-left: 1px solid var(--color-line);
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 0 0 0 4px;
	}
	.line {
		min-width: 0;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 18px;
	}
	.who {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		transition: color 0.3s;
	}
	.dots {
		display: flex;
		gap: 4px;
	}
	.dots i {
		height: 5px;
		width: 5px;
		border-radius: 999px;
		background: var(--color-line);
		transition:
			width 0.25s,
			background 0.25s;
	}
	.dots i.past {
		background: color-mix(in srgb, var(--color-brand) 45%, var(--color-line));
	}
	.dots i.on {
		width: 16px;
		background: var(--color-brand);
	}
	.count {
		font-size: 11px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--color-faint);
	}
	.hint {
		margin-left: auto;
		font-size: 11px;
		color: var(--color-faint);
	}
	/* every possible line sits in the same grid cell, the invisible ones set the height */
	.stack {
		display: grid;
		margin-top: 4px;
		max-height: calc(1.6em * 6);
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-width: thin;
	}
	.stack.more {
		mask-image: linear-gradient(to bottom, #000 calc(100% - 2.2em), transparent);
	}
	.stack > .text {
		grid-area: 1 / 1;
	}
	.text {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: color-mix(in srgb, var(--color-ink) 92%, transparent);
	}
	.stack {
		font-size: 15px;
	}
	.sizer {
		visibility: hidden;
		pointer-events: none;
		user-select: none;
	}
	.live {
		cursor: default;
	}
	.live :global(.w) {
		opacity: 0;
		animation: word 0.3s ease-out forwards;
		animation-delay: calc(var(--i) * 24ms);
	}
	.live.all :global(.w) {
		animation: none;
		opacity: 1;
	}
	@keyframes word {
		from {
			opacity: 0;
			filter: blur(2px);
		}
		to {
			opacity: 1;
			filter: none;
		}
	}
	.text.clamp {
		margin: 2px 0 0;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 13.5px;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.back {
		border-radius: 12px;
		padding: 9px 12px;
		font-size: 14px;
		font-weight: 500;
		color: var(--color-muted);
		transition:
			color 0.15s,
			background 0.15s;
	}
	.back:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}
	.next {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		background: var(--color-brand);
		padding: 11px 18px 11px 22px;
		font-size: 14px;
		font-weight: 650;
		color: #fff;
		box-shadow: 0 3px 0 rgba(28, 74, 160, 0.55);
		transition:
			filter 0.15s,
			transform 0.1s;
	}
	.next svg {
		transition: transform 0.2s;
	}
	.next:enabled:hover {
		filter: brightness(1.08);
	}
	.next:enabled:hover svg {
		transform: translateX(2px);
	}
	.next:enabled:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 rgba(28, 74, 160, 0.55);
	}
	.next:disabled {
		cursor: not-allowed;
		opacity: 0.4;
		box-shadow: none;
	}
	.fold {
		display: flex;
		height: 30px;
		width: 30px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		color: var(--color-faint);
		transition:
			color 0.15s,
			background 0.15s;
	}
	.fold:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}
	.collapsed .bubble {
		padding-top: 7px;
		padding-bottom: 7px;
	}
	.collapsed .tail {
		bottom: 50%;
		margin-bottom: -8px;
	}
	.collapsed .avatar {
		align-self: center;
	}
	@media (max-width: 767px) {
		.dock {
			grid-template-columns: minmax(0, 1fr);
		}
		/* on a phone Nim peeks over the top left corner of the bubble, in a small round badge so
		   the white cloud never melts into the white bubble */
		.avatar {
			position: absolute;
			left: 8px;
			top: -26px;
			z-index: 1;
			margin: 0;
			display: flex;
			height: 50px;
			width: 50px;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--color-line);
			border-radius: 999px;
			background: var(--color-brand-soft);
			box-shadow: 0 4px 12px rgba(22, 40, 60, 0.12);
		}
		.bubble {
			grid-template-columns: minmax(0, 1fr);
			gap: 6px;
			border-radius: 20px;
			padding: 10px 12px 10px 14px;
		}
		.meta {
			padding-left: 52px;
		}
		.tail {
			display: none;
		}
		.text,
		.stack {
			font-size: 14px;
		}
		.stack {
			max-height: calc(1.6em * 7);
		}
		.count {
			display: none;
		}
		.controls {
			justify-content: flex-end;
		}
		.collapsed .avatar {
			position: static;
			height: 40px;
			width: 40px;
		}
		.collapsed.dock {
			grid-template-columns: auto minmax(0, 1fr);
			align-items: center;
		}
		.collapsed .bubble {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.collapsed .meta {
			padding-left: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bubble,
		.dots i,
		.live :global(.w) {
			transition: none;
			animation: none;
			opacity: 1;
		}
	}

	button {
		position: relative;
		-webkit-tap-highlight-color: transparent;
	}

	/* inline glossary chip (injected via {@html}, so the selector must be global). --tc is the
	   topic's accent color, set inline on each chip. */
	:global(.term) {
		display: inline;
		margin: 0;
		border: none;
		border-radius: 5px;
		background: color-mix(in srgb, var(--tc) 13%, transparent);
		padding: 0 4px;
		font: inherit;
		font-weight: 700;
		color: var(--tc);
		text-decoration: underline dotted var(--tc);
		text-underline-offset: 2px;
		cursor: pointer;
		transition: background 0.15s;
		-webkit-tap-highlight-color: transparent;
	}
	/* a chip that leads to a real lesson gets a tiny arrow, so it reads as "you can go there" */
	:global(.term-live)::after {
		content: '';
		display: inline-block;
		margin-left: 3px;
		width: 5px;
		height: 5px;
		border-top: 1.6px solid var(--tc);
		border-right: 1.6px solid var(--tc);
		transform: translateY(-2px) rotate(45deg);
	}
	:global(.term:hover) {
		background: color-mix(in srgb, var(--tc) 22%, transparent);
	}

	/* the "coming soon" card */
	.term-modal {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		pointer-events: auto;
	}
	.term-backdrop {
		position: absolute;
		inset: 0;
		background: rgba(22, 40, 60, 0.42);
		backdrop-filter: blur(1.5px);
	}
	.term-card {
		position: relative;
		width: min(92vw, 320px);
		border-radius: 20px;
		background: var(--color-card, #fff);
		padding: 22px 20px 18px;
		text-align: center;
		box-shadow: 0 18px 50px rgba(22, 40, 60, 0.28);
	}
	.term-soon {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--tc) 14%, transparent);
		padding: 4px 11px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--tc);
	}
	.term-soon .dot {
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background: var(--tc);
		animation: term-pulse 1.4s ease-in-out infinite;
	}
	.term-word {
		margin: 13px 0 0;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 20px;
		font-weight: 700;
		color: var(--tc);
	}
	.term-body {
		margin: 8px 0 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink, #1f2a37);
	}
	.term-note {
		margin: 6px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: #6b7682;
	}
	.term-ok {
		margin-top: 16px;
		width: 100%;
		border-radius: 12px;
		background: var(--color-brand, #2e6fe0);
		padding: 10px;
		font-size: 13.5px;
		font-weight: 700;
		color: #fff;
		transition: filter 0.15s;
	}
	.term-later {
		margin-top: 6px;
		width: 100%;
		border-radius: 12px;
		padding: 8px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted, #5e6b76);
		transition: color 0.15s;
	}
	.term-later:hover {
		color: var(--color-ink, #16212b);
	}
	.term-soon .dot.still {
		animation: none;
	}
	.term-ok:hover {
		filter: brightness(1.08);
	}
	@keyframes term-pulse {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.term-soon .dot {
			animation: none;
		}
	}
	/* a calm green "remember it" tag at the start of a memory trick line */
	.memo-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		vertical-align: 1px;
		margin-right: 8px;
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 9px 3px 7px;
		animation: fyi-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.5) both;
	}
	.memo-tag svg {
		width: 11px;
		height: 11px;
	}
	/* a lively "by the way" tag at the start of an FYI line */
	.fyi-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		vertical-align: 1px;
		margin-right: 8px;
		border-radius: 999px;
		background: linear-gradient(135deg, #f3b94e, #dd9e36);
		color: #fff;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.1em;
		padding: 3px 9px 3px 7px;
		box-shadow: 0 3px 9px rgba(221, 158, 54, 0.42);
		animation: fyi-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.5) both;
	}
	.fyi-tag svg {
		width: 11px;
		height: 11px;
		animation: fyi-twinkle 1.8s ease-in-out infinite;
	}
	@keyframes fyi-pop {
		from {
			opacity: 0;
			transform: scale(0.5) rotate(-10deg);
		}
		to {
			opacity: 1;
			transform: scale(1) rotate(0);
		}
	}
	@keyframes fyi-twinkle {
		0%,
		100% {
			transform: scale(1) rotate(0);
			opacity: 1;
		}
		50% {
			transform: scale(0.78) rotate(45deg);
			opacity: 0.8;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fyi-tag,
		.fyi-tag svg {
			animation: none;
		}
	}
</style>
