<script lang="ts">
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
		mood = 'calm',
		canNext = false,
		canBack = false,
		final = false,
		aside = false,
		onnext,
		onback,
		onjump
	}: {
		nim: string;
		mood?: Mood;
		canNext?: boolean;
		canBack?: boolean;
		final?: boolean;
		aside?: boolean;
		onnext?: () => void;
		onback?: () => void;
		/** Jump to another lesson from a cross link chip. Without it, lesson chips cannot jump. */
		onjump?: (ref: LessonRef) => void;
	} = $props();

	// Any line (a beat or a reaction) that starts with `[fyi]` is a "by the way" aside: the
	// bubble looks the same but leads with a small FYI tag. Reusable across every lesson.
	const FYI_MARK = '[fyi]';
	const isFyi = $derived(nim.trimStart().toLowerCase().startsWith(FYI_MARK));
	// `[ingat]` marks a memory trick (an easy way to remember the idea), with a green tag.
	const MEMO_MARK = '[ingat]';
	const isMemo = $derived(nim.trimStart().toLowerCase().startsWith(MEMO_MARK));
	const body = $derived(
		isFyi
			? nim.trimStart().slice(FYI_MARK.length).trimStart()
			: isMemo
				? nim.trimStart().slice(MEMO_MARK.length).trimStart()
				: nim
	);

	// Small screens only: that is where the bubble would otherwise cover the stage, so the
	// moderator-style auto close applies there. On desktop the bubble stays in its corner.
	let isMobile = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		const sync = () => (isMobile = mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	// Game-like companion: Nim sits pinned in the bottom-left corner and never moves; the cloud
	// bubble floats above it without resizing the stage. On a phone, when it is the learner's turn
	// (aside), Nim says its line, waits long enough to read it, then steps out on its own like a
	// game moderator so the stage gets full focus. A tap on Nim takes over for the current line;
	// any new line (a beat or a reaction) clears that, so reactions and completion pop Nim back.
	let override = $state<{ line: string; open: boolean } | null>(null);
	let autoHidden = $state<string | null>(null);
	const moderated = $derived(aside && isMobile);
	const base = $derived(moderated ? autoHidden !== nim : true);
	const open = $derived(override?.line === nim ? override.open : base);

	// A brief, snappy peek scaled a little to length (markup stripped), then Nim ducks out.
	function readMs(html: string) {
		const words = html
			.replace(/^\s*\[(fyi|ingat)\]\s*/i, '')
			.replace(/<[^>]*>/g, '')
			.trim()
			.split(/\s+/)
			.filter(Boolean).length;
		return Math.min(3500, Math.max(1300, 500 + words * 130));
	}

	$effect(() => {
		// Schedule the auto close once per line, only while moderated and not under a manual tap.
		if (!moderated || override?.line === nim || autoHidden === nim) return;
		const line = nim;
		const id = setTimeout(() => (autoHidden = line), readMs(line));
		return () => clearTimeout(id);
	});

	function toggle() {
		override = { line: nim, open: !open };
	}

	// Inline glossary chips: [[term|topic]] becomes a tappable chip (rendered inside {@html} so it
	// composes with any existing markup), and a tap opens a small "coming soon" card for that module.
	const html = $derived(renderTerms(body, $lang));
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
			if (!btn || !node.contains(btn)) return;
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

<svelte:window onkeydown={onTermKey} />

<div class="flex flex-col items-start gap-1.5 md:flex-row md:items-end md:gap-2">
	<!-- Cloud-shaped speech bubble: above Nim on mobile, beside (lifted) on desktop -->
	{#if open}
		<div
			transition:fly={{ y: 18, duration: 260, easing: cubicOut }}
			class="pointer-events-auto order-1 w-[calc(100vw-1.5rem)] max-w-[360px] min-w-0 md:order-2 md:mb-12 md:w-auto md:max-w-[340px]"
			style="filter: drop-shadow(0 10px 22px rgba(22,40,60,0.13));"
		>
			<div class="relative rounded-[26px] bg-card">
				<!-- cloud bumps (top) -->
				<span class="absolute -top-2.5 left-7 h-6 w-6 rounded-full bg-card"></span>
				<span class="absolute -top-4 left-14 h-9 w-9 rounded-full bg-card"></span>
				<span class="absolute -top-2 right-12 h-5 w-5 rounded-full bg-card"></span>
				<!-- trailing dots going down to Nim -->
				<span class="absolute -bottom-3 left-6 h-3.5 w-3.5 rounded-full bg-card"></span>
				<span class="absolute -bottom-7 left-2 h-2.5 w-2.5 rounded-full bg-card"></span>

				<div class="relative px-5 py-4">
					<div class="flex items-center justify-between">
						<p class="text-[11px] font-bold tracking-widest text-faint uppercase">Nim</p>
						<!-- send Nim "out": collapse the bubble to give the stage room -->
						<button
							onclick={toggle}
							aria-label={$t.hideNim}
							class="-mt-1 -mr-1.5 rounded-full p-1.5 text-faint transition-colors hover:text-ink"
						>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
								<path
									d="M3 5.5l4 4 4-4"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>

					{#key nim}
						<p
							use:termClicks
							in:fade={{ duration: 200 }}
							class="mt-1 min-h-[3.5rem] text-[14.5px] leading-relaxed text-ink/90 md:min-h-[4.5rem]"
						>
							{#if isFyi}<span class="fyi-tag"
									><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
										><path
											d="M12 1.6l1.7 8.7 8.7 1.7-8.7 1.7L12 22.4l-1.7-8.7L1.6 12l8.7-1.7z"
										/></svg
									>FYI</span
								>{/if}{#if isMemo}<span class="memo-tag"
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
								>{/if}{@html html}
						</p>
					{/key}

					<div class="mt-3 flex items-center justify-end gap-2">
						{#if canBack}
							<button
								onclick={onback}
								class="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
							>
								{$t.back}
							</button>
						{/if}
						<button
							onclick={onnext}
							disabled={!canNext}
							class="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_rgba(28,74,160,0.5)] transition-all enabled:hover:brightness-110 enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0_rgba(28,74,160,0.5)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
						>
							{final ? $t.finish : $t.next}
						</button>
					</div>

					{#if !canNext}
						<p class="mt-2 text-right text-[11px] text-faint">{$t.completeHint}</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Nim, the character: pinned bottom-left, shared element that glides between pages.
	     Tap to toggle the bubble (bring it back when it has stepped out). -->
	<button
		type="button"
		onclick={toggle}
		aria-label={open ? $t.hideNim : $t.showNim}
		aria-expanded={open}
		class="pointer-events-auto order-2 shrink-0 self-start outline-none md:order-1 md:self-end"
		class:nim-call={!open}
		style="view-transition-name: nim;"
	>
		<span class="block md:hidden"><Nim {mood} size={58} /></span>
		<span class="hidden md:block"><Nim {mood} size={112} /></span>
		{#if !open}
			<!-- a soft pulse that invites tapping Nim back open -->
			<span class="ping" aria-hidden="true"></span>
		{/if}
	</button>

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
	/* gentle bob to signal Nim is waiting when the bubble is out */
	.nim-call {
		animation: nim-bob 2.4s ease-in-out infinite;
	}
	@keyframes nim-bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
	.ping {
		position: absolute;
		top: 6px;
		right: 6px;
		height: 9px;
		width: 9px;
		border-radius: 9999px;
		background: var(--color-brand);
		box-shadow: 0 0 0 0 rgba(46, 111, 224, 0.5);
		animation: nim-ping 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
	}
	@keyframes nim-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0.45);
		}
		70% {
			box-shadow: 0 0 0 9px rgba(46, 111, 224, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nim-call,
		.ping {
			animation: none;
		}
	}
</style>
