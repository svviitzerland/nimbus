<script lang="ts">
	// A guided browser lesson. The page builds itself in slow motion as Nim narrates, one beat at a
	// time: the address is typed, index.html arrives, the DOM tree grows, a plain page is painted,
	// then CSS, the picture, and JavaScript land one by one. On the last beat the learner may flip
	// CSS off to see what it really does.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BrowserText } from '$lib/chapters/web/browser/types';
	import { prefersReducedMotion } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BrowserText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	// Which beat brings which file in. On that beat the file loads for a moment, then lands.
	const FILES = [
		{ name: 'index.html', at: 1 },
		{ name: 'style.css', at: 4 },
		{ name: 'nim.png', at: 5 },
		{ name: 'app.js', at: 6 }
	];
	const FILE_BEATS = FILES.map((f) => f.at);

	let arrived = $state(true);
	$effect(() => {
		const s = step;
		const still = reduce;
		return untrack(() => {
			arrived = still || !FILE_BEATS.includes(s);
			if (arrived) return;
			const t = setTimeout(() => (arrived = true), 1400);
			return () => clearTimeout(t);
		});
	});

	// How far the page has been built. Beats after the last file show the finished page.
	const level = $derived(step >= 7 ? 6 : FILE_BEATS.includes(step) && !arrived ? step - 1 : step);
	const fileState = (at: number) =>
		level >= at ? 'done' : step === at && !arrived ? 'loading' : 'wait';

	let cssOff = $state(false);
	const painted = $derived(level >= 3);
	const css = $derived(level >= 4 && !(step === last && cssOff));
	const img = $derived(level >= 5);
	const js = $derived(level >= 6);

	function toggleCss() {
		cssOff = !cssOff;
		onstate?.(cssOff ? 'nocss' : 'cssback');
	}

	// The address types itself on the first beat.
	const URL = 'nimbus.com';
	let typed = $state(URL.length);
	$effect(() => {
		const s = step;
		const still = reduce;
		return untrack(() => {
			if (s !== 0 || still) {
				typed = URL.length;
				return;
			}
			typed = 0;
			const t = setInterval(() => {
				typed += 1;
				if (typed >= URL.length) clearInterval(t);
			}, 140);
			return () => clearInterval(t);
		});
	});

	// Once JavaScript is running, the Like button counts up by itself and the tip changes.
	let likes = $state(3);
	let tip = $state(0);
	$effect(() => {
		const on = js;
		const still = reduce;
		return untrack(() => {
			if (!on || still) return;
			const t = setInterval(() => {
				likes += 1;
				tip = (tip + 1) % tx.page.tips.length;
			}, 1900);
			return () => clearInterval(t);
		});
	});

	const TREE = [
		{ tag: 'html', d: 0 },
		{ tag: 'head', d: 1 },
		{ tag: 'body', d: 1 },
		{ tag: 'nav', d: 2 },
		{ tag: 'h1', d: 2 },
		{ tag: 'p', d: 2 },
		{ tag: 'img', d: 2 },
		{ tag: 'button', d: 2 }
	];
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<button type="button" class="switch" role="switch" aria-checked={!cssOff} onclick={toggleCss}>
				<span class="track" class:on={!cssOff}><span class="knob"></span></span>
				<span>{tx.cssToggle} {cssOff ? tx.off : tx.on}</span>
			</button>
		{/if}

		<div class="win">
			<div class="top">
				<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="addr">
					{URL.slice(0, typed)}{#if step === 0 && typed < URL.length}<span class="caret"
						></span>{/if}
				</span>
			</div>

			<div class="files" aria-label={tx.filesLabel}>
				{#each FILES as f (f.name)}
					<span class="file {fileState(f.at)}">
						<span class="fbar"></span>
						<span class="fname">{f.name}</span>
					</span>
				{/each}
			</div>

			<div class="view">
				{#if level === 2}
					<div class="dom">
						<span class="cap">{tx.domLabel}</span>
						<ul>
							{#each TREE as n, k (n.tag)}
								<li
									class:root={n.d === 0}
									style="--d:{n.d}; animation-delay:{reduce ? 0 : k * 0.28}s"
								>
									<span class="node">{n.tag}</span>
								</li>
							{/each}
						</ul>
					</div>
				{:else if painted}
					<div class="page" class:styled={css}>
						<nav>
							{#each tx.page.nav as n (n)}<span class="link">{n}</span>{/each}
						</nav>
						<h4>{tx.page.heading}</h4>
						<p>{tx.page.text}</p>
						<div class="row">
							<div class="pic" class:in={img}>
								{#if img}
									<svg viewBox="0 0 120 80" aria-label={tx.page.alt} role="img">
										<path
											d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z"
											class="nim"
										/>
										<circle cx="50" cy="44" r="5" fill="#fff" />
										<circle cx="72" cy="44" r="5" fill="#fff" />
										<circle cx="51" cy="45" r="2.4" fill="#16212b" />
										<circle cx="73" cy="45" r="2.4" fill="#16212b" />
										<path
											d="M53 56q8 6 16 0"
											fill="none"
											stroke="#fff"
											stroke-width="3"
											stroke-linecap="round"
										/>
									</svg>
								{:else}
									<span class="alt">{tx.page.alt}</span>
								{/if}
							</div>
							<div class="act">
								<span class="like" class:live={js}>
									{tx.page.like}{#if js}<b>{likes}</b>{/if}
								</span>
								{#if js}
									<span class="tip">{tx.page.tips[tip]}</span>
								{/if}
							</div>
						</div>
					</div>
				{:else}
					<p class="blank">{level >= 1 ? tx.blank : ''}</p>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	/* ---- the CSS switch ---- */
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 5px 12px 5px 6px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.track {
		position: relative;
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.track.on {
		background: var(--color-grass);
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s;
	}
	.track.on .knob {
		transform: translateX(12px);
	}

	/* ---- the browser window ---- */
	.win {
		width: 100%;
		max-width: 440px;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
	}
	.top {
		display: flex;
		align-items: center;
		gap: 10px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 12px;
	}
	.lights {
		display: inline-flex;
		gap: 5px;
	}
	.lights i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.addr {
		flex: 1;
		min-height: 24px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 3px 12px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.caret {
		display: inline-block;
		width: 1.5px;
		height: 13px;
		margin-left: 1px;
		vertical-align: -2px;
		background: var(--color-brand);
		animation: caret 0.8s steps(2) infinite;
	}
	@keyframes caret {
		50% {
			opacity: 0;
		}
	}

	.files {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
		border-bottom: 1px solid var(--color-line);
		padding: 8px 10px;
	}
	.file {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		padding: 4px 6px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
		transition:
			color 0.3s,
			border-color 0.3s,
			background 0.3s;
	}
	.fname {
		position: relative;
		white-space: nowrap;
	}
	.fbar {
		position: absolute;
		inset: 0;
		width: 0;
		background: var(--color-brand-soft);
	}
	.file.loading {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.file.loading .fbar {
		animation: load 1.35s ease-out forwards;
	}
	@keyframes load {
		to {
			width: 100%;
		}
	}
	.file.done {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	.view {
		position: relative;
		height: 236px;
		overflow: hidden;
	}
	.blank {
		display: grid;
		height: 100%;
		margin: 0;
		place-items: center;
		font-size: 13px;
		color: var(--color-faint);
	}

	/* ---- the DOM tree ---- */
	.dom {
		padding: 12px 18px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.dom ul {
		margin: 8px 0 0;
		padding: 0;
		list-style: none;
	}
	.dom li {
		position: relative;
		padding: 2px 0 2px calc(var(--d) * 22px);
		opacity: 0;
		animation: grow 0.4s ease forwards;
	}
	.dom li::before {
		content: '';
		position: absolute;
		top: 50%;
		left: calc(var(--d) * 22px - 14px);
		width: 10px;
		border-top: 1.5px solid var(--color-line);
	}
	.dom li.root::before {
		display: none;
	}
	@keyframes grow {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.node {
		display: inline-block;
		border: 1px solid var(--color-brand);
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 0 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-brand);
	}

	/* ---- the page, plain first (browser defaults), then dressed by CSS ---- */
	.page {
		height: 100%;
		padding: 10px 14px;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14px;
		color: var(--color-ink);
		animation: paint 0.5s ease;
	}
	@keyframes paint {
		from {
			opacity: 0;
		}
	}
	.page nav {
		display: flex;
		gap: 10px;
	}
	.page .link {
		color: var(--color-brand);
		text-decoration: underline;
	}
	.page h4 {
		margin: 8px 0 4px;
		font-size: 21px;
		font-weight: 700;
	}
	.page p {
		margin: 0 0 10px;
		line-height: 1.35;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.pic {
		display: grid;
		flex: none;
		width: 88px;
		height: 60px;
		place-items: center;
		border: 1px solid var(--color-line);
	}
	.pic svg {
		width: 78px;
		animation: pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1.2);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.7);
		}
	}
	.nim {
		fill: var(--color-brand);
	}
	.alt {
		padding: 4px;
		text-align: center;
		font-size: 11px;
		color: var(--color-faint);
	}
	.act {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
	.like {
		display: inline-flex;
		gap: 6px;
		border: 1px solid #8f8f8f;
		border-radius: 2px;
		background: #efefef;
		padding: 1px 8px;
		font-family: system-ui, sans-serif;
		font-size: 13px;
		color: #16212b;
	}
	.tip {
		font-size: 12px;
		color: var(--color-muted);
	}

	.page.styled {
		font-family: inherit;
		font-size: 13.5px;
	}
	.page.styled nav {
		gap: 4px;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 4px;
		width: max-content;
		max-width: 100%;
	}
	.page.styled .link {
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		text-decoration: none;
	}
	.page.styled .link:first-child {
		background: var(--color-card);
		color: var(--color-ink);
	}
	.page.styled h4 {
		margin-top: 12px;
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.page.styled p {
		color: var(--color-muted);
		line-height: 1.5;
	}
	.page.styled .pic {
		border: 0;
		border-radius: 14px;
		background: var(--color-brand-soft);
	}
	.page.styled .like {
		border: 0;
		border-radius: 999px;
		background: var(--color-brand);
		padding: 5px 14px;
		font-weight: 700;
		color: #fff;
	}
	.like b {
		font-variant-numeric: tabular-nums;
	}
	.like.live b {
		animation: bump 1.9s ease infinite;
	}
	@keyframes bump {
		0%,
		12% {
			transform: scale(1.25);
		}
		30%,
		100% {
			transform: none;
		}
	}

	@media (max-width: 420px) {
		.file {
			font-size: 9.5px;
			padding: 4px 3px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dom li,
		.page,
		.pic svg,
		.like.live b,
		.caret {
			animation: none;
			opacity: 1;
		}
		.file.loading .fbar {
			animation: none;
			width: 100%;
		}
		.file,
		.track,
		.knob {
			transition: none;
		}
	}
</style>
