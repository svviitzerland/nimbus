<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { lang, t, setLang } from '$lib/i18n';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';
	import Nim from '$lib/components/Nim.svelte';
	import TrackPicker from '$lib/components/TrackPicker.svelte';
	import { path } from '$lib/path.svelte';
	import type { Track } from '$lib/tracks';

	let beat = $state(0);
	// on a phone, Nim adds a cheeky note recommending a bigger screen, and sizing adapts
	let small = $state(false);
	let reduced = $state(false);
	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const mq = window.matchMedia('(max-width: 767px)');
		small = mq.matches;
		const onChange = (e: MediaQueryListEvent) => {
			const picking = isLast;
			small = e.matches;
			if (picking) beat = $t.welcome.length - 1 + (small ? 1 : 0);
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	// The last welcome line introduces the track picker. On a phone
	// the "bigger screen" note slots in just before that question.
	const lines = $derived(
		small ? [...$t.welcome.slice(0, -1), $t.welcomeMobile, ...$t.welcome.slice(-1)] : $t.welcome
	);
	const shown = $derived(Math.min(beat, lines.length - 1));
	const isLast = $derived(beat >= lines.length - 1);

	function next() {
		if (!isLast) beat += 1;
	}
	function back() {
		if (beat > 0) beat -= 1;
	}
	function pick(track: Track) {
		path.setTrack(track.id);
		path.cancelDetour();
		const r = path.firstOpen(track);
		// The view transition in the root layout glides Nim from here to the lesson corner.
		if (r) goto(resolve('/[chapter]/[lesson]', { chapter: r.chapterId, lesson: r.lessonId }));
	}
	function onKey(e: KeyboardEvent) {
		const control =
			e.target instanceof Element &&
			e.target.closest('button, a, input, textarea, select, [contenteditable]');
		if (e.code === 'Space' && !isLast && !control && !e.repeat) {
			e.preventDefault();
			next();
		}
	}

	// Nim speaks each welcome line word by word (only faded in, so nothing moves), and the mouth
	// moves while the words come in.
	let talking = $state(false);
	function speak(node: HTMLElement) {
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
		const texts: Text[] = [];
		while (walker.nextNode()) texts.push(walker.currentNode as Text);
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
		const timer = setTimeout(() => (talking = false), i * 28 + 300);
		return { destroy: () => clearTimeout(timer) };
	}

	// soft clouds drifting across the sky behind everything
	const CLOUDS = [
		{ top: 9, size: 150, dur: 70, delay: -10, o: 0.9 },
		{ top: 26, size: 90, dur: 55, delay: -38, o: 0.7 },
		{ top: 58, size: 120, dur: 80, delay: -55, o: 0.6 },
		{ top: 76, size: 70, dur: 48, delay: -20, o: 0.55 }
	];
</script>

<svelte:head>
	<title
		>{$lang === 'id'
			? 'Nimbus, belajar teknologi sambil main'
			: 'Nimbus, learn tech by playing'}</title
	>
</svelte:head>

<svelte:window onkeydown={onKey} />

<div
	class="relative flex min-h-dvh flex-col overflow-x-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, var(--bg-grad-1) 0%, var(--bg-grad-2) 55%, var(--bg-grad-3) 100%);"
>
	<!-- the sky -->
	<div class="sky" aria-hidden="true">
		{#each CLOUDS as c, k (k)}
			<svg
				class="drift"
				viewBox="0 0 120 60"
				style="top:{c.top}%; width:{c.size}px; opacity:{c.o}; animation-duration:{c.dur}s; animation-delay:{c.delay}s"
			>
				<path
					d="M22 52 Q4 52 6 38 Q8 26 22 28 Q24 10 44 12 Q58 0 74 12 Q96 8 98 28 Q116 28 114 42 Q112 52 98 52 Z"
				/>
			</svg>
		{/each}
	</div>

	<header
		class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8"
	>
		<span class="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
			<svg width="22" height="22" viewBox="0 0 120 60" aria-hidden="true" class="logo">
				<path
					d="M22 52 Q4 52 6 38 Q8 26 22 28 Q24 10 44 12 Q58 0 74 12 Q96 8 98 28 Q116 28 114 42 Q112 52 98 52 Z"
				/>
			</svg>
			Nimbus
		</span>
		<div class="flex items-center gap-2">
			<GitHubLink />
			<ThemeToggle />
			<div
				class="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-[11px] font-bold backdrop-blur"
				style="background: var(--header-btn-bg);"
			>
				<button
					onclick={() => setLang('id')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'id' ? 'background: var(--toggle-active);' : ''}
				>
					ID
				</button>
				<button
					onclick={() => setLang('en')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'en' ? 'background: var(--toggle-active);' : ''}
				>
					EN
				</button>
			</div>
		</div>
	</header>

	<main
		class="relative z-10 flex flex-1 flex-col items-center px-4 pb-12 md:px-6"
		class:justify-center={!isLast}
		class:pt-6={isLast}
		class:choosing={isLast}
	>
		<!-- The welcome becomes a companion column when the track picker opens. -->
		<section class="hero" class:compact={isLast}>
			<div class="nim" style="view-transition-name: nim">
				<Nim
					mood={isLast ? 'excited' : beat === 0 ? 'happy' : 'wink'}
					{talking}
					size={isLast ? (small ? 84 : 160) : small ? 128 : 176}
				/>
			</div>

			<div class="bubble">
				<span class="tail" aria-hidden="true"></span>
				<p class="who">Nim</p>
				<div class="stack">
					{#key shown}
						<p class="say live" class:all={reduced} use:speak aria-live="polite">
							<!-- Curated lesson markup, never learner input. -->
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html lines[shown]}
						</p>
					{/key}
				</div>
				<div class="foot">
					<span class="dots" aria-hidden="true">
						{#each lines as _l, k (k)}
							<i class:on={k === shown} class:past={k < shown}></i>
						{/each}
					</span>
					<span class="actions">
						{#if beat > 0}
							<button class="back" onclick={back}>{$t.back}</button>
						{/if}
						{#if !isLast}
							<button class="next" onclick={next}>
								{$t.next}
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
									><path
										d="M9 5l7 7-7 7"
										stroke="currentColor"
										stroke-width="2.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
							</button>
						{/if}
					</span>
				</div>
			</div>
		</section>

		{#if !isLast}
			<p class="hint" in:fade>{small ? $t.hintTap : $t.hintSpace}</p>
		{:else}
			<section
				class="pick"
				in:fly={{ y: reduced ? 0 : 16, duration: reduced ? 0 : 420, easing: cubicOut }}
			>
				<h1>{$t.pickTitle}</h1>
				<p class="sub">{$t.pickSub}</p>
				<TrackPicker landing onpick={pick} current={path.chosen ? path.track.id : undefined} />
			</section>
		{/if}
	</main>
</div>

<style>
	.sky {
		pointer-events: none;
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.drift {
		position: absolute;
		left: -200px;
		height: auto;
		fill: var(--color-card);
		filter: drop-shadow(0 6px 12px rgba(22, 40, 60, 0.05));
		animation: drift linear infinite;
	}
	@keyframes drift {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(100vw + 400px));
		}
	}
	.logo {
		fill: var(--color-brand);
	}

	.hero {
		display: flex;
		width: min(100%, 760px);
		align-items: flex-end;
		gap: 22px;
		transition: width 0.4s;
	}
	.hero.compact {
		width: min(100%, 680px);
	}
	.nim {
		flex: none;
		margin-bottom: 6px;
	}
	.bubble {
		position: relative;
		flex: 1;
		min-width: 0;
		border: 1px solid var(--color-line);
		border-radius: 26px;
		background: var(--color-card);
		padding: 18px 22px 16px;
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--color-line) 60%, transparent),
			0 22px 48px rgba(22, 40, 60, 0.12);
	}
	.tail {
		position: absolute;
		left: -9px;
		bottom: 34px;
		height: 18px;
		width: 18px;
		transform: rotate(45deg);
		border-left: 1px solid var(--color-line);
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 0 0 0 4px;
	}
	.who {
		margin: 0;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-brand);
	}
	.stack {
		display: grid;
		margin-top: 6px;
	}
	.say {
		grid-area: 1 / 1;
		margin: 0;
		font-size: 16.5px;
		line-height: 1.65;
		color: color-mix(in srgb, var(--color-ink) 92%, transparent);
	}
	.compact .say {
		font-size: 15px;
	}
	.live :global(.w) {
		opacity: 0;
		animation: word 0.32s ease-out forwards;
		animation-delay: calc(var(--i) * 28ms);
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
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 14px;
		min-height: 42px;
	}
	.dots {
		display: flex;
		gap: 5px;
	}
	.dots i {
		height: 6px;
		width: 6px;
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
		width: 20px;
		background: var(--color-brand);
	}
	.actions {
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
	}
	.back:hover {
		color: var(--color-ink);
	}
	.next {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		background: var(--color-brand);
		padding: 11px 18px 11px 24px;
		font-size: 14px;
		font-weight: 650;
		color: #fff;
		box-shadow: 0 3px 0 rgba(28, 74, 160, 0.55);
		transition:
			filter 0.15s,
			transform 0.1s;
	}
	.next:hover {
		filter: brightness(1.08);
	}
	.next:active {
		transform: translateY(2px);
		box-shadow: 0 1px 0 rgba(28, 74, 160, 0.55);
	}
	.hint {
		margin-top: 22px;
		font-size: 11.5px;
		color: var(--color-faint);
	}

	.pick {
		margin-top: 34px;
		width: min(100%, 880px);
		text-align: center;
	}
	.pick h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 600;
		line-height: 1.2;
		color: var(--color-ink);
	}
	.pick .sub {
		margin: 6px 0 20px;
		font-size: 14px;
		color: var(--color-muted);
	}

	@media (min-width: 1024px) {
		main.choosing {
			display: grid;
			width: min(100%, 1440px);
			grid-template-columns: minmax(220px, 0.3fr) minmax(0, 1fr);
			align-content: center;
			align-items: center;
			gap: clamp(28px, 3.5vw, 56px);
			margin-inline: auto;
			padding: 20px 32px 24px;
		}
		.choosing .hero {
			width: 100%;
			flex-direction: column-reverse;
			align-items: center;
			gap: 24px;
		}
		.choosing .bubble {
			width: 100%;
			flex: none;
			padding: 20px;
		}
		.choosing .tail {
			left: calc(50% - 9px);
			bottom: -9px;
			transform: rotate(-45deg);
		}
		.choosing .nim {
			margin-bottom: 0;
		}
		.choosing .pick {
			width: 100%;
			min-width: 0;
			margin-top: 0;
			text-align: left;
		}
		.choosing .pick .sub {
			margin-bottom: 18px;
		}
	}
	@media (min-width: 1024px) and (max-height: 700px) {
		main.choosing {
			padding-block: 12px 20px;
		}
		.choosing .pick .sub {
			margin-bottom: 12px;
		}
		.choosing .hero {
			gap: 12px;
		}
	}

	@media (max-width: 767px) {
		.hero {
			flex-direction: column;
			align-items: center;
			gap: 14px;
		}
		.hero.compact {
			flex-direction: row;
			align-items: flex-end;
			gap: 10px;
		}
		.bubble {
			width: 100%;
			padding: 16px 18px 14px;
		}
		.hero:not(.compact) .tail {
			left: 50%;
			top: -9px;
			bottom: auto;
			margin-left: -9px;
			transform: rotate(135deg);
		}
		.compact .tail {
			bottom: 24px;
		}
		.say {
			font-size: 15.5px;
		}
		.compact .say {
			font-size: 14px;
		}
		.compact .bubble {
			padding: 12px 14px 10px;
		}
		.compact .foot {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hero,
		.dots i {
			transition: none;
		}
		.drift {
			animation: none;
			left: auto;
			right: 6%;
		}
		.live :global(.w) {
			animation: none;
			opacity: 1;
		}
	}
</style>
