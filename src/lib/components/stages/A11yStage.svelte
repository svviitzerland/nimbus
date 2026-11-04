<script lang="ts">
	// Guided accessibility. A signup page sits above its HTML, and a screen reader walks through
	// it by itself, a ring on the piece it is reading and a caption strip with what it says.
	// Nim's beats fix the HTML line by line (alt, label, a real button, contrast) and the reader
	// changes its words as soon as each line is typed. The only play is an optional blindfold.
	import { onDestroy, untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { A11yText } from '$lib/chapters/web/a11y/types';
	import Guide from '../Guide.svelte';
	import TypedCode from './frontend/TypedCode.svelte';
	import { NIM_DATA } from './frontend/code';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as A11yText);

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

	// ---- The HTML, fixed one line at a time ----
	const LIGHT = '#aab3bb';
	const DARK = '#5e6b76';
	const FILE = 'nim.png';
	function htmlAt(v: number) {
		const p = tx.page;
		const out = [
			v >= 2 ? `<img src="${FILE}" alt="${p.alt}">` : `<img src="${FILE}">`,
			`<h1>${p.heading}</h1>`,
			`<p style="color: ${v >= 6 ? DARK : LIGHT}">${p.tagline}</p>`
		];
		if (v >= 3) out.push(`<label for="email">${p.email}</label>`);
		out.push(v >= 3 ? '<input id="email" type="email">' : '<input type="email">');
		out.push(v >= 4 ? `<button>${p.subscribe}</button>` : `<div class="btn">${p.subscribe}</div>`);
		return out.join('\n') + '\n';
	}
	const code = $derived(htmlAt(view));
	let settled = $state(untrack(() => code));

	// What the page really has right now, read from the finished code.
	const hasAlt = $derived(settled.includes(' alt="'));
	const hasLabel = $derived(settled.includes('<label'));
	const hasButton = $derived(settled.includes('<button'));
	const dark = $derived(settled.includes(DARK));

	// ---- Contrast, the real WCAG formula ----
	function lum(hex: string) {
		const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
		const [r, g, b] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}
	const ratioOf = (hex: string) => 1.05 / (lum(hex) + 0.05);
	const ratio = $derived(ratioOf(dark ? DARK : LIGHT));
	const ratioText = $derived(
		tx.ratio.replace(
			'{n}',
			new Intl.NumberFormat(tx.voiceLang, {
				minimumFractionDigits: 1,
				maximumFractionDigits: 1
			}).format(ratio)
		)
	);

	// ---- The screen reader ----
	type Piece = 'img' | 'h1' | 'p' | 'input' | 'button' | 'end';
	const ORDER: Piece[] = ['img', 'h1', 'p', 'input', 'button', 'end'];
	function say(p: Piece): string {
		const r = tx.roles;
		if (p === 'img') return `${r.image}, ${hasAlt ? tx.page.alt : FILE}`;
		if (p === 'h1') return `${r.heading}, ${tx.page.heading}`;
		if (p === 'p') return tx.page.tagline;
		if (p === 'input')
			return hasLabel
				? `${tx.page.email}, ${r.editText}, ${tx.blank}`
				: `${r.editText}, ${tx.blank}`;
		if (p === 'button') return hasButton ? `${tx.page.subscribe}, ${r.button}` : tx.skipped;
		return tx.endOfPage;
	}
	const PIN: Record<number, Piece> = { 2: 'img', 3: 'input', 4: 'button', 6: 'p' };
	let walk = $state(-1);
	let timer: ReturnType<typeof setInterval> | undefined;
	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function play(v: number) {
		clearInterval(timer);
		walk = -1;
		if (v === 0 || PIN[v]) return;
		walk = 0;
		if (!reduced())
			timer = setInterval(() => {
				walk = (walk + 1) % ORDER.length;
			}, 2000);
	}
	$effect(() => {
		const v = view;
		untrack(() => play(v));
	});
	onDestroy(() => clearInterval(timer));

	const at = $derived<Piece | null>(PIN[view] ?? (walk >= 0 ? ORDER[walk] : null));
	const caption = $derived(at ? say(at) : tx.readerIdle);
	// A div that only looks like a button never gets the ring, the reader cannot land on it.
	const ring = (p: Piece) => at === p && !(p === 'button' && !hasButton);

	// ---- Optional blindfold, with the device voice when there is one ----
	let blind = $state(false);
	let blindSaid = false;
	function toggleBlind() {
		blind = !blind;
		if (blind && !blindSaid) {
			blindSaid = true;
			onstate?.('blind');
		}
		if (!blind && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
	}
	$effect(() => {
		const line = caption;
		if (!blind || typeof speechSynthesis === 'undefined') return;
		untrack(() => {
			speechSynthesis.cancel();
			const u = new SpeechSynthesisUtterance(line);
			u.lang = tx.voiceLang;
			speechSynthesis.speak(u);
		});
	});
	onDestroy(() => {
		if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
	});
</script>

<div class="h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full justify-center pb-28 md:pb-6">
		<Guide steps={tx.steps} active={view} onselect={(k) => (view = k)}>
			{#snippet visual()}
				<div class="flex w-full max-w-[440px] flex-col gap-3">
					{#if view >= last}
						<button type="button" class="blind" aria-pressed={blind} onclick={toggleBlind}
							>{tx.blindfold}</button
						>
					{/if}

					<div class="browser">
						<div class="addr"><span class="url">{tx.previewLabel}</span></div>
						<div class="page" aria-hidden="true">
							<img class="nim" class:ring={ring('img')} src={NIM_DATA} alt="" />
							<p class="h1" class:ring={ring('h1')}>{tx.page.heading}</p>
							<p class="tag" class:ring={ring('p')} style="color:{dark ? DARK : LIGHT}">
								{tx.page.tagline}
							</p>
							<div class="field" class:ring={ring('input')}>
								{#if hasLabel}<span class="lab">{tx.page.email}</span>{/if}
								<span class="input"></span>
							</div>
							<span class="sub" class:ring={ring('button')}>{tx.page.subscribe}</span>
							{#if blind}
								<div class="cover"><span>{tx.cover}</span></div>
							{/if}
						</div>
						<div class="reader" role="status">
							<span class="rlabel">{tx.readerLabel}</span>
							{#key caption}
								<span class="rsay" class:muted={at === 'button' && !hasButton}>{caption}</span>
							{/key}
						</div>
					</div>

					{#if view >= 6}
						<div class="meter">
							<div class="mrow">
								<span>{tx.contrastLabel}</span>
								<b class:ok={ratio >= 4.5}>{ratioText}</b>
							</div>
							<div class="bar">
								<span
									class="fill"
									class:ok={ratio >= 4.5}
									style="width:{Math.min(100, (ratio / 7) * 100)}%"
								></span>
								<span class="need" style="left:{(4.5 / 7) * 100}%"></span>
							</div>
							<p class="needtxt">{tx.need}</p>
						</div>
					{/if}

					<TypedCode {code} lang="html" label={tx.htmlLabel} onsettled={(c) => (settled = c)} />
				</div>
			{/snippet}
		</Guide>
	</div>
</div>

<style>
	.blind {
		align-self: flex-start;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.blind[aria-pressed='true'] {
		background: var(--color-ink);
		border-color: var(--color-ink);
		color: var(--color-paper);
	}
	.browser {
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.addr {
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
	}
	.url {
		display: block;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	.page {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px 18px 18px;
		background: #fff;
		color: #16212b;
		text-align: center;
	}
	.page > * {
		border-radius: 8px;
		outline: 3px solid transparent;
		outline-offset: 3px;
		transition: outline-color 0.3s;
	}
	.page .ring {
		outline-color: #2e6fe0;
	}
	.nim {
		height: 46px;
	}
	.h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
	}
	.tag {
		margin: 0;
		font-size: 12.5px;
		transition:
			color 0.6s,
			outline-color 0.3s;
	}
	.field {
		display: flex;
		width: min(100%, 230px);
		flex-direction: column;
		align-items: flex-start;
		gap: 3px;
	}
	.lab {
		font-size: 12px;
		font-weight: 700;
	}
	.input {
		display: block;
		width: 100%;
		height: 30px;
		border: 1px solid #c9d0d6;
		border-radius: 8px;
	}
	.sub {
		padding: 6px 18px;
		border-radius: 999px;
		background: #2e6fe0;
		color: #fff;
		font-size: 13px;
		font-weight: 700;
	}
	.cover {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		background: #16212b;
		color: #e0dcd4;
		font-size: 13px;
		font-weight: 600;
		outline: none;
	}
	.reader {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 54px;
		padding: 8px 12px;
		border-top: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.rlabel {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.rsay {
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		animation: rise 0.35s ease-out;
	}
	.rsay.muted {
		font-weight: 500;
		font-style: italic;
		color: var(--color-muted);
	}
	.meter {
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.mrow {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.mrow b {
		color: var(--color-danger);
	}
	.mrow b.ok {
		color: var(--color-grass);
	}
	.bar {
		position: relative;
		height: 8px;
		margin-top: 7px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-danger);
		transition:
			width 0.8s ease,
			background 0.4s;
	}
	.fill.ok {
		background: var(--color-grass);
	}
	.need {
		position: absolute;
		top: -4px;
		bottom: -4px;
		width: 2px;
		background: var(--color-ink);
	}
	.needtxt {
		margin: 5px 0 0;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.page > *,
		.tag,
		.fill {
			transition: none;
		}
		.rsay {
			animation: none;
		}
	}
</style>
