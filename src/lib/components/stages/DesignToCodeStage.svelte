<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { DesignToCodeText, DesignProp } from '$lib/chapters/web/design-to-code/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as DesignToCodeText);

	// What the designer drew. The learner's CSS starts a little off on every value.
	const TARGET = { color: '#2E6FE0', radius: 12, padding: 28, font: 18 };
	const SWATCHES = ['#16212B', '#3A9C64', '#DD9E36', '#2E6FE0'];
	const RANGES = {
		radius: { min: 0, max: 24, step: 2 },
		padding: { min: 8, max: 40, step: 4 },
		font: { min: 12, max: 24, step: 1 }
	};

	let inspected = $state(false);
	let color = $state('#3A9C64');
	let radius = $state(2);
	let padding = $state(12);
	let font = $state(14);

	const ok = $derived<Record<DesignProp, boolean>>({
		color: color === TARGET.color,
		radius: radius === TARGET.radius,
		padding: padding === TARGET.padding,
		font: font === TARGET.font
	});
	const ORDER: DesignProp[] = ['color', 'radius', 'padding', 'font'];
	const count = $derived(ORDER.filter((p) => ok[p]).length);
	const allOk = $derived(count === ORDER.length);

	const reported = new Set<DesignProp>();
	let finished = false;
	$effect(() => {
		const now = ok;
		const fresh = ORDER.filter((p) => now[p] && !reported.has(p));
		if (!fresh.length) return;
		fresh.forEach((p) => reported.add(p));
		if (ORDER.every((p) => now[p])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			}
			return;
		}
		onstate?.(fresh[fresh.length - 1]);
	});

	function inspect() {
		if (inspected) return;
		inspected = true;
		onstate?.('inspect');
	}

	function nudge(prop: 'radius' | 'padding' | 'font', dir: 1 | -1) {
		const r = RANGES[prop];
		const cur = prop === 'radius' ? radius : prop === 'padding' ? padding : font;
		const next = Math.min(r.max, Math.max(r.min, cur + dir * r.step));
		if (prop === 'radius') radius = next;
		else if (prop === 'padding') padding = next;
		else font = next;
	}

	const specs = $derived([
		{ k: 'color' as DesignProp, v: TARGET.color },
		{ k: 'radius' as DesignProp, v: `${TARGET.radius}px` },
		{ k: 'padding' as DesignProp, v: `${TARGET.padding}px` },
		{ k: 'font' as DesignProp, v: `${TARGET.font}px` }
	]);
</script>

{#snippet stepper(prop: 'radius' | 'padding' | 'font', value: number)}
	<span class="step">
		<button
			type="button"
			aria-label="smaller"
			disabled={!inspected || value <= RANGES[prop].min}
			onclick={() => nudge(prop, -1)}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
				><path d="M2.5 6h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg
			>
		</button>
		<span class="num">{value}px</span>
		<button
			type="button"
			aria-label="bigger"
			disabled={!inspected || value >= RANGES[prop].max}
			onclick={() => nudge(prop, 1)}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
				><path
					d="M2.5 6h7M6 2.5v7"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/></svg
			>
		</button>
	</span>
{/snippet}

{#snippet tick(on: boolean)}
	<span class="tick" class:on aria-hidden="true">
		{#if on}
			<svg width="10" height="10" viewBox="0 0 12 12"
				><path
					d="m2.5 6.3 2.3 2.3 4.7-5"
					stroke="currentColor"
					stroke-width="1.9"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
		{/if}
	</span>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="wrap">
		<!-- the designer's frame -->
		<div class="frame design">
			<div class="cap">
				<span class="fig" aria-hidden="true"><i></i><i></i><i></i></span>
				{tx.designLabel}
				{#if !inspected}
					<button type="button" class="inspect" onclick={inspect}>{tx.inspect}</button>
				{/if}
			</div>
			<div class="canvas">
				<span class="sel" class:on={inspected}>
					<span
						class="demo"
						style="background:{TARGET.color};border-radius:{TARGET.radius}px;padding:12px {TARGET.padding}px;font-size:{TARGET.font}px"
						>{tx.button}</span
					>
					{#if inspected}
						<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i>
					{/if}
				</span>
			</div>
			{#if inspected}
				<div class="specs">
					{#each specs as s (s.k)}
						<span class="spec">
							<span>{tx.props[s.k]}</span>
							<b>
								{#if s.k === 'color'}<i class="sw" style="background:{s.v}"></i>{/if}
								{s.v}
							</b>
						</span>
					{/each}
				</div>
			{:else}
				<p class="hint">{tx.inspectHint}</p>
			{/if}
		</div>

		<!-- the learner's page, drawn from their CSS -->
		<div class="frame page" class:match={allOk}>
			<div class="cap">
				<span class="led" class:on={allOk}></span>
				{tx.pageLabel}
				<span class="score">{tx.score.replace('{n}', String(count)).replace('{total}', '4')}</span>
			</div>
			<div class="canvas plain">
				<span
					class="demo"
					style="background:{color};border-radius:{radius}px;padding:12px {padding}px;font-size:{font}px"
					>{tx.button}</span
				>
			</div>
		</div>

		<!-- the CSS, with the values as live controls -->
		<div class="code" class:locked={!inspected}>
			<div class="fname">{tx.codeLabel}</div>
			<div class="lines">
				<div class="ln"><span class="selr">.start</span> <span class="pun">{'{'}</span></div>
				<div class="ln in">
					{@render tick(ok.color)}
					<span class="prop">background</span><span class="pun">:</span>
					<span class="swatches">
						{#each SWATCHES as s (s)}
							<button
								type="button"
								class="swb"
								class:cur={color === s}
								style="background:{s}"
								aria-label={s}
								disabled={!inspected}
								onclick={() => (color = s)}
							></button>
						{/each}
					</span>
					<span class="val">{color}</span>
				</div>
				<div class="ln in">
					{@render tick(ok.radius)}
					<span class="prop">border-radius</span><span class="pun">:</span>
					{@render stepper('radius', radius)}
				</div>
				<div class="ln in">
					{@render tick(ok.padding)}
					<span class="prop">padding</span><span class="pun">:</span>
					<span class="val">12px</span>
					{@render stepper('padding', padding)}
				</div>
				<div class="ln in">
					{@render tick(ok.font)}
					<span class="prop">font-size</span><span class="pun">:</span>
					{@render stepper('font', font)}
				</div>
				<div class="ln"><span class="pun">{'}'}</span></div>
			</div>
		</div>

		{#if allOk}
			<p class="win">{tx.matched}</p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
		width: min(94vw, 400px);
	}
	.frame {
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
		transition: border-color 0.3s ease;
	}
	.frame.match {
		border-color: var(--color-grass);
	}
	.cap {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.fig {
		display: inline-flex;
		gap: 2px;
	}
	.fig i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-amber);
	}
	.fig i:nth-child(2) {
		background: var(--color-brand);
	}
	.fig i:nth-child(3) {
		background: var(--color-grass);
	}
	.inspect {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 4px 11px;
		font-size: 11px;
		font-weight: 700;
		animation: nudge 1.8s ease-in-out infinite;
	}
	@keyframes nudge {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.2);
		}
	}
	.score {
		margin-left: auto;
		font-size: 11px;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.on {
		background: var(--color-grass);
	}
	.canvas {
		display: grid;
		place-items: center;
		min-height: 78px;
		padding: 12px;
		background-color: var(--color-paper);
		background-image: radial-gradient(var(--color-line) 1px, transparent 1px);
		background-size: 12px 12px;
	}
	.canvas.plain {
		background-image: none;
		background-color: #fff;
	}
	.demo {
		display: inline-block;
		color: #fff;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		transition:
			background 0.2s ease,
			border-radius 0.2s ease,
			padding 0.2s ease,
			font-size 0.2s ease;
	}
	.sel {
		position: relative;
		display: inline-block;
		outline: 1.5px solid transparent;
		outline-offset: 3px;
	}
	.sel.on {
		outline-color: var(--color-brand);
	}
	.h {
		position: absolute;
		width: 7px;
		height: 7px;
		background: #fff;
		border: 1.5px solid var(--color-brand);
	}
	.tl {
		top: -7px;
		left: -7px;
	}
	.tr {
		top: -7px;
		right: -7px;
	}
	.bl {
		bottom: -7px;
		left: -7px;
	}
	.br {
		bottom: -7px;
		right: -7px;
	}
	.specs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px 10px;
		padding: 8px 10px;
		border-top: 1px solid var(--color-line);
	}
	.spec {
		display: flex;
		justify-content: space-between;
		gap: 6px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.spec b {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-ink);
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 3px;
	}
	.hint {
		margin: 0;
		padding: 7px 10px;
		border-top: 1px solid var(--color-line);
		font-size: 11px;
		color: var(--color-faint);
		text-align: center;
	}

	.code {
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		overflow: hidden;
		transition: opacity 0.3s ease;
	}
	.code.locked {
		opacity: 0.55;
	}
	.fname {
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.lines {
		padding: 8px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		color: var(--color-ink);
	}
	.ln {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 5px;
		min-height: 28px;
	}
	.ln.in {
		padding-left: 2px;
	}
	.selr {
		color: var(--color-amber);
		font-weight: 600;
	}
	.prop {
		color: var(--color-brand);
		font-weight: 600;
	}
	.pun {
		color: var(--color-faint);
	}
	.val {
		color: var(--color-grass);
	}
	.tick {
		display: grid;
		place-items: center;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		color: #fff;
	}
	.tick.on {
		border-color: var(--color-grass);
		background: var(--color-grass);
	}
	.swatches {
		display: inline-flex;
		gap: 5px;
	}
	.swb {
		width: 20px;
		height: 20px;
		border-radius: 6px;
		border: 2px solid transparent;
		box-shadow: 0 0 0 1px var(--color-line);
	}
	.swb.cur {
		border-color: var(--color-card);
		box-shadow: 0 0 0 2px var(--color-ink);
	}
	.step {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.step button {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 7px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	.step button:disabled {
		opacity: 0.4;
	}
	.num {
		min-width: 38px;
		text-align: center;
		color: var(--color-grass);
		font-variant-numeric: tabular-nums;
	}
	.win {
		align-self: center;
		margin: 0;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 12.5px;
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.demo,
		.frame,
		.code {
			transition: none;
		}
		.inspect {
			animation: none;
		}
	}
</style>
