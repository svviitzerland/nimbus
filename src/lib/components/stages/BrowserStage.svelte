<script lang="ts">
	import { onDestroy } from 'svelte';
	import Nim from '$lib/components/Nim.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { BrowserText } from '$lib/chapters/web/browser/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BrowserText);

	type FileKey = 'html' | 'css' | 'img' | 'js';
	const FILES: { key: FileKey; name: string; size: string; ms: number }[] = [
		{ key: 'html', name: 'index.html', size: '4 KB', ms: 800 },
		{ key: 'css', name: 'style.css', size: '9 KB', ms: 900 },
		{ key: 'img', name: 'nim.png', size: '38 KB', ms: 1500 },
		{ key: 'js', name: 'app.js', size: '14 KB', ms: 1000 }
	];

	// How many files have arrived (0 is the empty tab), and which one is on its way.
	let step = $state(0);
	let loading = $state(-1);
	let cssOn = $state(true);
	let jsOn = $state(true);
	let likes = $state(0);
	let tip = $state(0);
	let likedOnce = false;
	let finished = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const styled = $derived(step >= 2 && cssOn);
	const hasImg = $derived(step >= 3);
	const live = $derived(step >= 4 && jsOn);
	const busy = $derived(loading >= 0);
	const workLine = $derived(
		busy ? tx.downloading.replace('{file}', FILES[loading].name) : tx.work[step]
	);

	function reduced() {
		return (
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		);
	}

	function advance() {
		if (busy) return;
		if (step >= FILES.length) {
			step = 0;
			likes = 0;
			tip = 0;
			cssOn = true;
			jsOn = true;
			likedOnce = false;
			onstate?.('again');
			return;
		}
		const i = step;
		loading = i;
		timer = setTimeout(
			() => {
				loading = -1;
				step = i + 1;
				onstate?.(FILES[i].key);
				if (step === FILES.length && !finished) {
					finished = true;
					oncomplete?.();
				}
			},
			reduced() ? 150 : FILES[i].ms
		);
	}

	function like() {
		if (!live) {
			onstate?.('deadbutton');
			return;
		}
		likes += 1;
		if (!likedOnce) {
			likedOnce = true;
			onstate?.('liked');
		}
	}

	function toggleCss() {
		cssOn = !cssOn;
		if (!cssOn) onstate?.('nocss');
	}
	function toggleJs() {
		jsOn = !jsOn;
		if (!jsOn) onstate?.('nojs');
	}

	// JavaScript at work, the little line under the button changes by itself.
	$effect(() => {
		if (!live) return;
		const n = tx.page.tips.length;
		const id = setInterval(() => (tip = (tip + 1) % n), 2600);
		return () => clearInterval(id);
	});

	onDestroy(() => clearTimeout(timer));

	function fileState(i: number) {
		return i < step ? 'done' : i === loading ? 'load' : 'wait';
	}
</script>

<div class="wrap">
	<div class="acts">
		<button type="button" class="cta" onclick={advance} disabled={busy}>
			{step >= FILES.length ? tx.again : tx.steps[step]}
		</button>
		{#if step >= FILES.length}
			<div class="toggles">
				<button
					type="button"
					class="tog"
					class:off={!cssOn}
					aria-pressed={cssOn}
					onclick={toggleCss}
				>
					<span class="sw" aria-hidden="true"><i></i></span>
					{tx.cssToggle}
					<span class="st">{cssOn ? tx.on : tx.off}</span>
				</button>
				<button type="button" class="tog" class:off={!jsOn} aria-pressed={jsOn} onclick={toggleJs}>
					<span class="sw" aria-hidden="true"><i></i></span>
					{tx.jsToggle}
					<span class="st">{jsOn ? tx.on : tx.off}</span>
				</button>
			</div>
		{/if}
	</div>

	<p class="work" role="status">{workLine}</p>

	<div class="split">
		<!-- the browser window with the page growing inside -->
		<div class="win">
			<div class="wbar">
				<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="url">nimbus.com</span>
			</div>
			<div class="view">
				{#if step === 0}
					{#if busy}
						<span class="spin" aria-hidden="true"></span>
					{:else}
						<span class="blank">{tx.blank}</span>
					{/if}
				{:else}
					<div class="pg" class:styled class:live>
						<div class="nav">
							<span class="logo">Nimbus</span>
							<span class="links">
								{#each tx.page.nav as n (n)}<span class="lnk">{n}</span>{/each}
							</span>
						</div>
						<div class="hero">
							{#if hasImg}
								<span class="pic"
									><Nim size={styled ? 54 : 44} mood={likes > 0 ? 'happy' : 'calm'} /></span
								>
							{:else}
								<span class="alt">{tx.page.alt}</span>
							{/if}
							<span class="h">{tx.page.heading}</span>
							<span class="t">{tx.page.text}</span>
							<button type="button" class="like" onclick={like}>
								{tx.page.like}
								{#if step >= FILES.length}<b>{likes}</b>{/if}
							</button>
							{#key tip}
								<span class="tip">{tx.page.tips[tip]}</span>
							{/key}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- every file is its own little request -->
		<div class="net">
			<p class="cap">{tx.networkLabel}</p>
			<ul>
				{#each FILES as f, i (f.key)}
					{@const s = fileState(i)}
					<li class={s}>
						<span class="fn">
							<b>{f.name}</b>
							<span>{tx.fileRoles[f.key]}</span>
						</span>
						<span class="size">{f.size}</span>
						<span class="track">
							<span class="fill" style="--d:{f.ms}ms"></span>
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 640px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 20px;
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
	.toggles {
		display: flex;
		gap: 6px;
	}
	.tog {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 10px 6px 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.st {
		font-weight: 600;
		color: var(--color-grass);
	}
	.tog.off .st {
		color: var(--color-faint);
	}
	.sw {
		position: relative;
		width: 26px;
		height: 15px;
		border-radius: 999px;
		background: var(--color-grass);
		transition: background 0.2s ease;
	}
	.sw i {
		position: absolute;
		top: 2px;
		left: 13px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #fff;
		transition: left 0.2s ease;
	}
	.tog.off .sw {
		background: var(--color-line);
	}
	.tog.off .sw i {
		left: 2px;
	}
	.work {
		margin: 0;
		min-height: 1.4em;
		max-width: 420px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.split {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.win {
		width: 100%;
		max-width: 320px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
	}
	.wbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.url {
		flex: 1;
		border-radius: 7px;
		background: var(--color-paper);
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.view {
		position: relative;
		display: flex;
		height: 232px;
		align-items: center;
		justify-content: center;
		background: var(--color-card);
		overflow: hidden;
	}
	.blank {
		font-size: 12px;
		color: var(--color-faint);
	}
	.spin {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 3px solid var(--color-line);
		border-top-color: var(--color-brand);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* the page with no CSS yet, the browser's plain defaults */
	.pg {
		align-self: stretch;
		width: 100%;
		padding: 8px 10px;
		font-family: 'Times New Roman', Times, serif;
		font-size: 12.5px;
		color: var(--color-ink);
		animation: appear 0.3s ease;
		transition:
			background 0.4s ease,
			color 0.4s ease;
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.nav,
	.hero {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3px;
	}
	.hero {
		margin-top: 6px;
	}
	.logo {
		font-weight: 700;
	}
	.links {
		display: flex;
		gap: 6px;
	}
	.lnk {
		color: var(--color-brand);
		text-decoration: underline;
	}
	.alt {
		border: 1px solid var(--color-line);
		padding: 8px 10px;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.pic {
		line-height: 0;
	}
	.h {
		font-size: 17px;
		font-weight: 700;
		line-height: 1.2;
	}
	.t {
		line-height: 1.35;
	}
	.like {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-top: 3px;
		border-radius: 3px;
		border: 1px solid var(--color-faint);
		background: var(--color-line);
		padding: 1px 8px;
		font-family: ui-sans-serif, system-ui, sans-serif;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.tip {
		font-size: 11px;
		font-style: italic;
	}

	/* style.css arrived, same content and a whole new look */
	.pg.styled {
		padding: 0;
		font-family: var(--font-sans);
		background: var(--color-paper);
	}
	.styled .nav {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 7px 12px;
		background: var(--color-card);
		border-bottom: 1px solid var(--color-line);
	}
	.styled .logo {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.styled .lnk {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-decoration: none;
	}
	.styled .hero {
		align-items: center;
		gap: 5px;
		margin: 0;
		padding: 10px 16px;
		text-align: center;
	}
	.styled .alt {
		border-radius: 10px;
		border-color: transparent;
		background: var(--color-brand-soft);
	}
	.styled .h {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
	}
	.styled .t {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.styled .like {
		border: none;
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		padding: 5px 14px;
		font-family: var(--font-sans);
		font-size: 11.5px;
		font-weight: 600;
	}
	.styled .tip {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		padding: 2px 9px;
		font-size: 10px;
		font-style: normal;
		font-weight: 600;
	}
	.live .like {
		cursor: pointer;
	}
	.live .tip {
		animation: appear 0.35s ease;
	}

	.net {
		width: 100%;
		max-width: 320px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
	}
	.cap {
		margin: 0 0 6px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.net ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.net li {
		display: grid;
		grid-template-columns: 1fr auto 64px;
		align-items: center;
		gap: 8px;
		color: var(--color-faint);
		transition: color 0.2s ease;
	}
	.net li.load,
	.net li.done {
		color: var(--color-ink);
	}
	.fn {
		display: flex;
		min-width: 0;
		flex-direction: column;
		line-height: 1.2;
	}
	.fn b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
	}
	.fn span {
		font-size: 10px;
		color: var(--color-faint);
	}
	.size {
		font-size: 10.5px;
		font-weight: 600;
	}
	.track {
		height: 6px;
		border-radius: 999px;
		background: var(--color-line);
		overflow: hidden;
	}
	.fill {
		display: block;
		width: 0;
		height: 100%;
		border-radius: 999px;
		background: var(--color-brand);
	}
	.load .fill {
		animation: fill var(--d) linear forwards;
	}
	.done .fill {
		width: 100%;
		background: var(--color-grass);
	}
	@keyframes fill {
		to {
			width: 100%;
		}
	}

	:global(.dark) .cta {
		box-shadow: none;
		color: var(--color-ink);
	}
	:global(.dark) .win {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}
		.pg,
		.live .tip,
		.load .fill {
			animation-duration: 0.01s;
		}
		.pg,
		.sw,
		.sw i,
		.net li {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.split {
			flex-direction: row;
			align-items: flex-start;
			justify-content: center;
		}
		.win {
			max-width: 340px;
		}
		.net {
			max-width: 260px;
		}
		.cta {
			font-size: 14px;
			padding: 11px 24px;
		}
		.work {
			font-size: 13px;
		}
	}
</style>
