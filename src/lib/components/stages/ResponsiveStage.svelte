<script lang="ts">
	// Guided responsive design. The real nimbus.com page runs in a sandboxed iframe whose width
	// the stage animates by itself, so the media queries inside it actually fire and the page
	// truly reflows. Nim's beats rewrite style.css from a fixed 960 pixel page to phone first
	// with two breakpoints. The only play is optional, a width slider on the last beat.
	import { onDestroy, untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ResponsiveText } from '$lib/chapters/web/responsive/types';
	import Guide from '../Guide.svelte';
	import TypedCode from './frontend/TypedCode.svelte';
	import { NIM_DATA, esc, pageDoc } from './frontend/code';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ResponsiveText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let view = $state(0);
	$effect(() => {
		view = beat;
	});
	const last = $derived(tx.steps.length - 1);

	// ---- The stylesheet Nim writes, beat by beat ----
	const FIXED = [
		'body {',
		'  width: 960px;',
		'}',
		'.cards {',
		'  grid-template-columns: 1fr 1fr 1fr;',
		'}',
		''
	].join('\n');
	const PHONE = ['.cards {', '  grid-template-columns: 1fr;', '}', ''].join('\n');
	const TABLET =
		PHONE +
		[
			'',
			'@media (min-width: 600px) {',
			'  .cards {',
			'    grid-template-columns: 1fr 1fr;',
			'  }',
			'}',
			''
		].join('\n');
	const LAPTOP =
		TABLET +
		[
			'',
			'@media (min-width: 900px) {',
			'  .cards {',
			'    grid-template-columns: 1fr 1fr 1fr;',
			'  }',
			'  .links { display: flex; }',
			'  .menu { display: none; }',
			'}',
			''
		].join('\n');
	const code = $derived(view <= 1 ? FIXED : view === 2 ? PHONE : view === 3 ? TABLET : LAPTOP);
	let settled = $state(untrack(() => code));

	// The look of the page stays hidden, only the layout rules are shown in the editor.
	const BASE = [
		'*{box-sizing:border-box}',
		'html{background:#fff;color:#16212b}',
		'body{margin:0;font:15px/1.45 system-ui,sans-serif}',
		'.nav{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;border-bottom:1px solid #e8e2d8}',
		'.logo{display:flex;align-items:center;gap:8px;font-weight:800}',
		'.logo img{height:26px}',
		'.links{display:none;gap:18px;color:#5e6b76;font-weight:600}',
		'.menu{padding:5px 12px;border:1px solid #e8e2d8;border-radius:999px;font-weight:600;font-size:13px}',
		'.hero{padding:22px 18px 12px}',
		'h1{margin:0 0 6px;font-size:26px;line-height:1.15}',
		'.hero p{margin:0;color:#5e6b76}',
		'.cards{display:grid;gap:12px;padding:10px 18px 22px}',
		'.card{border:1px solid #e8e2d8;border-radius:14px;padding:14px;background:#faf9f6}',
		'.card b{display:block;color:#2e6fe0}',
		'.card span{color:#5e6b76;font-size:14px}'
	].join('');
	const body = $derived(
		'<div class="nav">' +
			`<span class="logo"><img src="${NIM_DATA}" alt="">nimbus.com</span>` +
			`<span class="links">${tx.page.links.map((l) => `<span>${esc(l)}</span>`).join('')}</span>` +
			`<span class="menu">${esc(tx.page.menu)}</span>` +
			'</div>' +
			`<div class="hero"><h1>${esc(tx.page.heroTitle)}</h1><p>${esc(tx.page.heroText)}</p></div>` +
			'<div class="cards">' +
			tx.page.cards
				.map((c) => `<div class="card"><b>${esc(c.title)}</b><span>${esc(c.text)}</span></div>`)
				.join('') +
			'</div>'
	);
	const srcdoc = $derived(pageDoc({ css: BASE + settled, body }));

	// ---- The screen width, driven by the beat ----
	const FULL = 960;
	const PHONE_W = 360;
	const TABLET_W = 640;
	let width = $state(FULL);
	let loop: ReturnType<typeof setInterval> | undefined;
	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function play(v: number) {
		clearInterval(loop);
		if (v === 0 || v === 4) width = FULL;
		else if (v === 1 || v === 2) width = PHONE_W;
		else if (v === 3) width = TABLET_W;
		else if (v >= 5 && v < last) {
			const seq = [PHONE_W, TABLET_W, FULL, TABLET_W];
			let k = 0;
			width = seq[0];
			if (!reduced())
				loop = setInterval(() => {
					k = (k + 1) % seq.length;
					width = seq[k];
				}, 2400);
		} else width = TABLET_W;
	}
	$effect(() => {
		const v = view;
		untrack(() => play(v));
	});
	onDestroy(() => clearInterval(loop));

	let dragged = false;
	let dragging = $state(false);
	function onDrag() {
		dragging = true;
		if (!dragged) {
			dragged = true;
			onstate?.('drag');
		}
	}

	// ---- Scale everything so a 960 pixel screen fits the column ----
	let cw = $state(420);
	const scale = $derived(Math.max(0.2, Math.min(1, cw / FULL)));
	const VIEW_H = 230;
	const size = $derived(
		width < 600 ? tx.sizes.phone : width < 900 ? tx.sizes.tablet : tx.sizes.laptop
	);
	const spill = $derived(view <= 1 && width < FULL);
</script>

<div class="h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full justify-center pb-28 md:pb-6">
		<Guide steps={tx.steps} active={view} onselect={(k) => (view = k)}>
			{#snippet visual()}
				<div class="flex w-full max-w-[460px] flex-col gap-3">
					<div class="stagewrap" bind:clientWidth={cw}>
						<div class="frame" class:spill class:still={dragging} style="width:{width * scale}px">
							<div class="addr"><span class="url">{tx.previewLabel}</span></div>
							<div class="viewport" style="height:{VIEW_H}px">
								<iframe
									title={tx.previewLabel}
									sandbox=""
									{srcdoc}
									class:still={dragging}
									style="width:{width}px;height:{VIEW_H / scale}px;transform:scale({scale})"
								></iframe>
							</div>
						</div>

						<!-- The ruler with the two breakpoints and the current width -->
						<div class="ruler" aria-hidden="true">
							<span class="track"></span>
							{#each [600, 900] as bp (bp)}
								<span class="tick" class:on={width >= bp && view >= 3} style="left:{bp * scale}px"
									><i>{bp}</i></span
								>
							{/each}
							<span class="mark" class:still={dragging} style="left:{width * scale}px"></span>
						</div>
						<p class="wlabel">
							{tx.widthLabel.replace('{n}', String(Math.round(width)))} ({size})
						</p>
					</div>

					{#if view >= last}
						<label class="slider">
							<span>{tx.sliderLabel}</span>
							<input
								type="range"
								min="320"
								max={FULL}
								step="10"
								bind:value={width}
								oninput={onDrag}
								onchange={() => (dragging = false)}
							/>
						</label>
					{/if}

					<TypedCode {code} lang="css" label={tx.cssLabel} onsettled={(c) => (settled = c)} />
				</div>
			{/snippet}
		</Guide>
	</div>
</div>

<style>
	.stagewrap {
		width: 100%;
	}
	.frame {
		max-width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
		transition:
			width 1.2s cubic-bezier(0.45, 0, 0.2, 1),
			border-color 0.4s;
	}
	.frame.spill {
		border-color: var(--color-danger);
	}
	.addr {
		padding: 6px 8px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11px;
	}
	.url {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	.viewport {
		position: relative;
		overflow: hidden;
		background: #fff;
	}
	iframe {
		display: block;
		border: 0;
		background: #fff;
		transform-origin: 0 0;
		transition: width 1.2s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.still {
		transition: none !important;
	}

	.ruler {
		position: relative;
		height: 26px;
		margin-top: 10px;
	}
	.track {
		position: absolute;
		left: 0;
		right: 0;
		top: 6px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.tick {
		position: absolute;
		top: 1px;
		width: 2px;
		height: 12px;
		margin-left: -1px;
		background: var(--color-faint);
	}
	.tick i {
		position: absolute;
		top: 13px;
		left: 50%;
		transform: translateX(-50%);
		font-style: normal;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.tick.on {
		background: var(--color-brand);
	}
	.tick.on i {
		color: var(--color-brand);
	}
	.mark {
		position: absolute;
		top: 1px;
		width: 12px;
		height: 12px;
		margin-left: -6px;
		border-radius: 50%;
		background: var(--color-brand);
		box-shadow: 0 0 0 3px var(--color-brand-soft);
		transition: left 1.2s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.wlabel {
		margin: 4px 0 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.slider {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.slider input {
		flex: 1;
		min-width: 0;
		accent-color: var(--color-brand);
	}
	@media (prefers-reduced-motion: reduce) {
		.frame,
		iframe,
		.mark {
			transition: none;
		}
	}
</style>
