<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ResponsiveText, ResponsiveMissionId } from '$lib/chapters/web/responsive/types';
	import Missions from './frontend/Missions.svelte';
	import { NIM_DATA, esc, pageDoc } from './frontend/code';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ResponsiveText);

	// ---- Width and the responsive switch ----
	const MIN = 320;
	const MAX = 1280;
	const PRESETS = { phone: 375, tablet: 768, laptop: 1280 } as const;
	const TABLET = 600;
	const LAPTOP = 900;
	let width = $state(1280);
	let responsive = $state(true);
	let touched = $state(false);

	type Zone = 'phone' | 'tablet' | 'laptop';
	const zone = $derived<Zone>(width < TABLET ? 'phone' : width < LAPTOP ? 'tablet' : 'laptop');
	const layoutName = $derived(responsive ? tx.layouts[zone] : tx.layouts.fixed);

	// ---- The page. The HTML never changes, only which CSS applies ----
	const body = $derived(
		[
			'<nav>',
			'<span class="brand">nimbus.com</span>',
			`<span class="links">${tx.page.links.map((l) => `<a>${esc(l)}</a>`).join('')}</span>`,
			`<button class="menu">${esc(tx.page.menu)}</button>`,
			'</nav>',
			'<section class="hero">',
			`<img src="${NIM_DATA}" alt="">`,
			`<div><h1>${esc(tx.page.heroTitle)}</h1><p>${esc(tx.page.heroText)}</p><button class="cta">${esc(tx.page.cta)}</button></div>`,
			'</section>',
			'<section class="cards">',
			tx.page.cards
				.map((c) => `<div class="card"><h2>${esc(c.title)}</h2><p>${esc(c.text)}</p></div>`)
				.join(''),
			'</section>'
		].join('')
	);
	const BASE = [
		'*{box-sizing:border-box}',
		'html{background:#faf9f6;color:#16212b}',
		'body{margin:0;font:15px/1.45 system-ui,sans-serif}',
		'nav{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:#fff;border-bottom:1px solid #e8e2d8}',
		'.brand{font-weight:700;color:#2e6fe0}',
		'.links{display:none;gap:18px;color:#5e6b76}',
		'.menu{font:inherit;padding:4px 12px;border:1px solid #e8e2d8;border-radius:8px;background:#fff}',
		'.hero{padding:20px 16px}',
		'.hero img{display:block;height:64px}',
		'.hero h1{margin:8px 0 4px;font-size:24px;line-height:1.2}',
		'.hero p{margin:0 0 12px;color:#5e6b76}',
		'.cta{font:inherit;font-weight:600;padding:8px 16px;border:0;border-radius:999px;background:#2e6fe0;color:#fff}',
		'.cards{display:grid;grid-template-columns:1fr;gap:12px;padding:0 16px 20px}',
		'.card{padding:14px;border:1px solid #e8e2d8;border-radius:12px;background:#fff}',
		'.card h2{margin:0 0 2px;font-size:16px}',
		'.card p{margin:0;color:#5e6b76}'
	].join('');
	const TABLET_CSS =
		'.cards{grid-template-columns:1fr 1fr}.hero{display:flex;align-items:center;gap:18px}.hero img{height:88px}';
	const LAPTOP_CSS =
		'.links{display:flex}.menu{display:none}.cards{grid-template-columns:repeat(3,1fr)}.hero h1{font-size:32px}';
	const css = $derived(
		responsive
			? `${BASE}@media (min-width:${TABLET}px){${TABLET_CSS}}@media (min-width:${LAPTOP}px){${LAPTOP_CSS}}`
			: `${BASE}body{width:960px}${TABLET_CSS}${LAPTOP_CSS}`
	);
	const srcdoc = $derived(pageDoc({ css, body }));

	// ---- Scaling: the frame really is `width` pixels wide, then shrunk to fit the stage ----
	let boxW = $state(360);
	const H = 250;
	const scale = $derived(Math.min(1, boxW / width));

	// ---- Missions: a layout counts once the screen settles in it for a moment ----
	let done = $state<Record<ResponsiveMissionId, boolean>>({
		phone: false,
		tablet: false,
		laptop: false,
		fixed: false
	});
	const ORDER: ResponsiveMissionId[] = ['phone', 'tablet', 'laptop', 'fixed'];
	const allDone = $derived(ORDER.every((m) => done[m]));
	let finished = false;
	let settle: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const key: ResponsiveMissionId | null = responsive ? zone : zone === 'phone' ? 'fixed' : null;
		clearTimeout(settle);
		if (!key || !touched) return;
		settle = setTimeout(() => {
			if (done[key]) return;
			done[key] = true;
			if (ORDER.every((m) => done[m]) && !finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			} else onstate?.(key);
		}, 450);
	});
	onDestroy(() => clearTimeout(settle));

	function setWidth(w: number) {
		touched = true;
		width = Math.max(MIN, Math.min(MAX, Math.round(w)));
	}
	function onSlide(e: Event) {
		setWidth(Number((e.currentTarget as HTMLInputElement).value));
	}
	function toggle() {
		touched = true;
		responsive = !responsive;
	}
	const pct = (w: number) => ((w - MIN) / (MAX - MIN)) * 100;
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		items={ORDER.map((m) => ({ id: m, text: tx.missions[m], done: done[m] }))}
	/>

	<div class="controls">
		<div class="presets" role="group" aria-label={tx.widthLabel}>
			{#each Object.entries(PRESETS) as [k, w] (k)}
				<button type="button" class="preset" class:on={zone === k} onclick={() => setWidth(w)}
					>{tx.presets[k as Zone]}</button
				>
			{/each}
		</div>
		<button
			type="button"
			class="switch"
			class:off={!responsive}
			role="switch"
			aria-checked={responsive}
			onclick={toggle}
		>
			<span class="knob" aria-hidden="true"></span>
			{tx.toggleLabel}
			<b>{responsive ? tx.on : tx.off}</b>
		</button>
	</div>

	<div class="slider">
		<div class="sl">
			<span>{tx.widthLabel}</span>
			<b>{width}px</b>
		</div>
		<div class="track">
			<input
				type="range"
				min={MIN}
				max={MAX}
				step="5"
				value={width}
				oninput={onSlide}
				aria-label={tx.widthLabel}
			/>
			<span class="mark" style:left="{pct(TABLET)}%" aria-hidden="true">{TABLET}</span>
			<span class="mark" style:left="{pct(LAPTOP)}%" aria-hidden="true">{LAPTOP}</span>
		</div>
	</div>

	<div class="stagebox" bind:clientWidth={boxW}>
		<div class="device" style:width="{width * scale}px" style:height="{H}px">
			<div class="addr">
				<span class="led" class:on={responsive}></span>
				<span class="url">{tx.previewLabel}</span>
			</div>
			<div class="viewport" style:height="{H - 30}px">
				<iframe
					title={tx.previewLabel}
					sandbox=""
					{srcdoc}
					style:width="{width}px"
					style:height="{(H - 30) / scale}px"
					style:transform="scale({scale})"
				></iframe>
			</div>
		</div>
		<p class="layout" class:bad={!responsive}>{layoutName}</p>
	</div>

	<div class="rules">
		<p class="cap">{tx.rulesLabel}</p>
		<div class="mq">
			<code class:live={responsive && width >= TABLET} class:dead={!responsive}
				>@media (min-width: {TABLET}px)</code
			>
			<code class:live={responsive && width >= LAPTOP} class:dead={!responsive}
				>@media (min-width: {LAPTOP}px)</code
			>
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
		gap: 8px;
	}
	.presets {
		display: inline-flex;
		padding: 3px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.preset {
		padding: 5px 12px;
		border-radius: 999px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.preset.on {
		background: var(--color-brand);
		color: #fff;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 5px 12px 5px 6px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.switch b {
		color: var(--color-grass);
	}
	.switch.off b {
		color: var(--color-danger);
	}
	.knob {
		position: relative;
		width: 28px;
		height: 16px;
		border-radius: 999px;
		background: var(--color-grass);
		transition: background 0.2s ease;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 14px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #fff;
		transition: left 0.2s ease;
	}
	.switch.off .knob {
		background: var(--color-line);
	}
	.switch.off .knob::after {
		left: 2px;
	}

	.slider {
		width: 100%;
		max-width: 520px;
	}
	.sl {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: var(--color-muted);
	}
	.sl b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-ink);
	}
	.track {
		position: relative;
		padding-bottom: 14px;
	}
	.track input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.mark {
		position: absolute;
		bottom: 0;
		transform: translateX(-50%);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		color: var(--color-faint);
	}
	.mark::before {
		content: '';
		position: absolute;
		left: 50%;
		top: -6px;
		width: 1px;
		height: 6px;
		background: var(--color-faint);
	}

	.stagebox {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 100%;
	}
	.device {
		max-width: 100%;
		display: flex;
		flex-direction: column;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
		transition: width 0.15s ease;
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 30px;
		padding: 0 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-danger);
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		flex: 1;
		min-width: 0;
		padding: 2px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.viewport {
		position: relative;
		overflow: hidden;
		background: #faf9f6;
	}
	iframe {
		display: block;
		border: 0;
		transform-origin: 0 0;
		background: #faf9f6;
	}
	.layout {
		margin: 0;
		padding: 3px 12px;
		border-radius: 999px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		font-size: 12px;
		font-weight: 700;
	}
	.layout.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.rules {
		width: 100%;
		max-width: 520px;
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
	.mq {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.mq code {
		padding: 4px 10px;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-faint);
		font-size: 12px;
		transition:
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}
	.mq code.live {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-weight: 600;
	}
	.mq code.dead {
		text-decoration: line-through;
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
		.preset,
		.knob,
		.knob::after,
		.device,
		.mq code {
			transition: none;
		}
	}
</style>
