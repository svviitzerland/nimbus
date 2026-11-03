<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { Ipv6Text } from '$lib/chapters/network/ipv6/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as Ipv6Text);

	// Rough number of devices that want to be online, in billions. Illustrative, not a census.
	const ERAS = [
		{ year: 1995, b: 0.05 },
		{ year: 2000, b: 0.4 },
		{ year: 2005, b: 1.2 },
		{ year: 2010, b: 3.6 },
		{ year: 2015, b: 10 },
		{ year: 2020, b: 20 },
		{ year: 2025, b: 30 }
	];
	const V4_BILLION = 4.295; // 2 to the power of 32, in billions
	const SEATS = 64;
	const V4_TOTAL = '4294967296';
	const V6_TOTAL = '340282366920938463463374607431768211456';

	let era = $state(-1);
	let v6 = $state(false);
	let sand = $state(false);
	let completed = false;

	const now = $derived(era >= 0 ? ERAS[era] : null);
	const filled = $derived(
		now ? Math.min(SEATS, Math.max(1, Math.round((now.b / V4_BILLION) * SEATS))) : 0
	);
	const left = $derived(now ? Math.max(0, now.b - V4_BILLION) : 0);
	const isFull = $derived(left > 0);

	function grow() {
		if (era >= ERAS.length - 1 || v6) return;
		era += 1;
		const e = ERAS[era];
		if (era === 0) onstate?.('grow');
		else if (e.b > V4_BILLION && ERAS[era - 1].b <= V4_BILLION) onstate?.('full');
		else if (e.b / V4_BILLION > 0.75 && e.b <= V4_BILLION) onstate?.('tight');
	}
	function toV6() {
		if (v6) return;
		v6 = true;
		onstate?.('ipv6');
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}
	function addSand() {
		sand = true;
		onstate?.('sand');
	}

	const fmtB = (n: number) =>
		tx.billion.replace(
			'{n}',
			(n < 1 ? n.toFixed(2) : n % 1 ? n.toFixed(1) : String(n)).replace('.', tx.decimal)
		);
	const group = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, tx.thousands);

	const note = $derived.by(() => {
		if (sand) return tx.notes.sand;
		if (v6) return tx.notes.v6;
		if (!now) return tx.notes.idle;
		if (isFull) return tx.notes.full;
		if (filled > SEATS * 0.75) return tx.notes.tight;
		return tx.notes.growing;
	});
	const outsideIcons = $derived(Math.min(8, Math.ceil(left / 2.5)));
	const kinds = ['phone', 'watch', 'tv', 'laptop'] as const;
</script>

<div class="wrap">
	<div class="btns">
		{#if !v6 && era < ERAS.length - 1}
			<CallToActionButton onclick={grow}>
				{tx.growBtn.replace('{year}', String(ERAS[era + 1].year))}
			</CallToActionButton>
		{/if}
		{#if !v6 && isFull}
			<CallToActionButton onclick={toV6}>
				{tx.switchBtn}
			</CallToActionButton>
		{/if}
		{#if v6}
			<CallToActionButton onclick={addSand} disabled={sand}>
				{tx.sandBtn}
			</CallToActionButton>
		{/if}
	</div>

	<div class="head">
		<span class="year">{now ? tx.yearLabel.replace('{year}', String(now.year)) : ' '}</span>
		{#if now}
			<span class="want">{tx.devicesLabel.replace('{n}', fmtB(now.b))}</span>
		{/if}
	</div>

	<div class="pool" class:six={v6}>
		<div class="ptop">
			<b>{v6 ? tx.poolV6 : tx.poolV4}</b>
			<span class="bits">{tx.bits.replace('{n}', v6 ? '128' : '32')}</span>
		</div>
		<div class="grid">
			{#each { length: SEATS }, i (i)}
				<span
					class="seat"
					class:on={!v6 && i < filled}
					class:last={!v6 && isFull}
					style="transition-delay:{v6 ? 0 : Math.max(0, i - (filled - 12)) * 18}ms"
				>
					{#if v6 && i === 0}
						<span class="dot"></span>
						{#if sand}<span class="dot sand"></span>{/if}
					{/if}
				</span>
			{/each}
			{#if v6}
				<span class="callout">
					{tx.dotLabel}{#if sand}<br /><em>{tx.sandLabel}</em>{/if}
				</span>
			{/if}
		</div>
		<span class="hint">{v6 ? tx.scale : tx.seatHint}</span>
	</div>

	{#if !v6 && isFull}
		<div class="outside">
			<div class="crowd">
				{#each { length: outsideIcons }, i (i)}
					<span class="who" style="animation-delay:{i * 60}ms">
						<Device kind={kinds[i % kinds.length]} size={24} tone="var(--color-danger)" />
					</span>
				{/each}
			</div>
			<span class="olabel">{tx.outside.replace('{n}', fmtB(left))}</span>
		</div>
	{/if}

	<p class="note">{note}</p>

	<div class="facts">
		<div class="fact">
			<span class="flabel">{tx.sampleLabel}</span>
			<code>{v6 ? '2001:0db8:4f2a:91c0:0000:0000:0000:0007' : '203.0.113.7'}</code>
		</div>
		<div class="fact">
			<span class="flabel">{tx.totalLabel}</span>
			<code class="total">{group(v6 ? V6_TOTAL : V4_TOTAL)}</code>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 12px;
	}
	.btns {
		display: flex;
		min-height: 46px;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.head {
		display: flex;
		min-height: 1.3em;
		align-items: baseline;
		gap: 10px;
	}
	.year {
		font-family: var(--font-display, serif);
		font-size: 18px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.want {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.pool {
		display: flex;
		width: min(94vw, 300px);
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		transition: border-color 0.4s;
	}
	.pool.six {
		border-color: var(--color-grass);
	}
	.ptop {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
	}
	.ptop b {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.bits {
		border-radius: 999px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		padding: 2px 8px;
		font-size: 10px;
		font-weight: 800;
	}
	.six .bits {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		gap: 4px;
		width: 100%;
	}
	.seat {
		position: relative;
		aspect-ratio: 1;
		border-radius: 5px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}
	.seat.on {
		background: var(--color-brand);
		border-color: var(--color-brand);
	}
	.seat.on.last {
		background: var(--color-danger);
		border-color: var(--color-danger);
	}
	.dot {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--color-grass);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-grass) 25%, transparent);
		animation: shrink 0.8s ease-out;
	}
	.dot.sand {
		left: 12px;
		background: var(--color-amber);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-amber) 25%, transparent);
	}
	@keyframes shrink {
		from {
			width: 200px;
			height: 200px;
			opacity: 0.2;
		}
	}
	.callout {
		position: absolute;
		top: 4px;
		left: 15%;
		border-radius: 8px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 3px 8px;
		font-size: 10px;
		font-weight: 700;
		line-height: 1.3;
		color: var(--color-grass);
		animation: fade 0.5s ease 0.5s both;
	}
	.callout em {
		font-style: normal;
		color: var(--color-amber);
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	.hint {
		max-width: 270px;
		text-align: center;
		font-size: 10.5px;
		line-height: 1.35;
		color: var(--color-faint);
	}
	.six .hint {
		color: var(--color-muted);
		font-weight: 600;
	}

	.outside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.crowd {
		display: flex;
		gap: 4px;
	}
	.who {
		animation: walk 0.4s ease both;
	}
	@keyframes walk {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.olabel {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-danger);
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.facts {
		display: flex;
		width: min(94vw, 360px);
		flex-direction: column;
		gap: 6px;
	}
	.fact {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.flabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	code {
		max-width: 100%;
		border-radius: 8px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 3px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-ink);
		text-align: center;
		overflow-wrap: anywhere;
	}

	@media (prefers-reduced-motion: reduce) {
		.seat {
			transition: none;
		}
		.dot,
		.callout,
		.who {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.pool {
			width: 340px;
		}
		.want,
		.note {
			font-size: 14px;
		}
		.note {
			max-width: 460px;
		}
		code {
			font-size: 12px;
		}
		.facts {
			width: 440px;
		}
	}
</style>
