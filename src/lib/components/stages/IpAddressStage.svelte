<script lang="ts">
	// Guided: a house with rooms. The public address hangs on the roof like a house number, every
	// device inside wears a private "room number", and a letter flies in from the internet. The
	// picture follows Nim's beats; on the last beat the learner may send a letter themselves.
	import { onDestroy, untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { IpAddressText } from '$lib/chapters/network/ip-address/types';
	import Guide from '$lib/components/Guide.svelte';
	import Thing from './netguide/Thing.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as IpAddressText);

	// watch first: visible from the start, and never blocking Next
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	const last = $derived(tx.intro.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const isLast = $derived(beat >= last);

	// the one optional interaction, a letter sent to a room number or to the house number
	type Shot = { to: 'room' | 'house'; n: number; landed: boolean };
	let shot = $state<Shot | null>(null);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let n = 0;
	function send(to: 'room' | 'house') {
		clearTimeout(timer);
		shot = { to, n: ++n, landed: false };
		timer = setTimeout(
			() => {
				if (shot) shot.landed = true;
				onstate?.(to === 'house' ? 'public' : 'lost');
			},
			to === 'house' ? 2300 : 1500
		);
	}
	onDestroy(() => clearTimeout(timer));

	// which part of the picture is in focus at each step
	const privHi = (s: number) => s === 2 || s === 4 || s === 5;
	const pubHi = (s: number) => s === 3 || s === 4 || s === 6;
</script>

<div class="wrap">
	<div class="tryrow" class:show={isLast} aria-hidden={!isLast}>
		<span class="trylabel">{tx.sendLabel}</span>
		<div class="trybtns">
			<button
				type="button"
				class="try"
				class:on={shot?.to === 'room'}
				disabled={!isLast}
				onclick={() => send('room')}>{tx.ips.laptop}</button
			>
			<button
				type="button"
				class="try pub"
				class:on={shot?.to === 'house'}
				disabled={!isLast}
				onclick={() => send('house')}>{tx.ips.routerOut}</button
			>
		</div>
	</div>

	<Guide steps={tx.steps} {active} onselect={(k) => (peek = k)}>
		{#snippet visual(s)}
			<svg viewBox="0 0 440 320" class="art" role="img" aria-label={tx.title}>
				<!-- the internet, where letters come from -->
				<Thing kind="cloud" x={70} y={52} s={1.5} />
				<text class="lbl" x="70" y="92">{tx.internetLabel}</text>

				<!-- the house next door, it reuses the same room numbers -->
				<g class="fade" class:gone={s < 5}>
					<polygon class="roof" points="12,214 66,170 120,214" />
					<rect class="wall" x="18" y="212" width="96" height="92" rx="3" />
					<Thing kind="laptop" x={66} y={276} s={0.7} />
					<g class="chip priv" class:hi={s === 5}>
						<rect x="22" y="226" width="88" height="20" rx="10" />
						<text x="66" y="240">{tx.ips.laptop}</text>
					</g>
					<text class="lbl" x="66" y="316">{tx.neighbourLabel}</text>
				</g>

				<!-- your house -->
				<polygon class="roof" points="140,152 287,64 434,152" />
				<rect class="wall" x="150" y="150" width="274" height="156" rx="3" />
				<line class="inner" x1="287" y1="152" x2="287" y2="248" />
				<line class="inner" x1="152" y1="248" x2="422" y2="248" />

				<!-- the house number on the roof, the public address -->
				<g class="chip pubchip" class:hi={pubHi(s)} class:soft={!pubHi(s) && s !== 7}>
					<rect x="227" y="104" width="120" height="26" rx="8" />
					<text x="287" y="121.5">{tx.ips.routerOut}</text>
				</g>
				<text class="tag pubtag" class:show={s === 4} x="287" y="144">{tx.streetTag}</text>

				<!-- the rooms -->
				<Thing kind="laptop" x={218} y={222} hi={s === 0} />
				<Thing kind="phone" x={356} y={220} />
				<Thing kind="router" x={287} y={284} hi={s === 3} />
				<g class="chip priv" class:hi={privHi(s) || s === 0}>
					<rect x="172" y="166" width="92" height="20" rx="10" />
					<text x="218" y="180">{tx.ips.laptop}</text>
				</g>
				<g class="chip priv" class:hi={privHi(s)}>
					<rect x="310" y="166" width="92" height="20" rx="10" />
					<text x="356" y="180">{tx.ips.phone}</text>
				</g>
				<g class="chip priv" class:hi={privHi(s)}>
					<rect x="326" y="272" width="88" height="20" rx="10" />
					<text x="370" y="286">{tx.ips.routerIn}</text>
				</g>
				<!-- left of the router, so the letter that lands on the router never covers it -->
				<text class="tag privtag" class:show={s === 4} x="206" y="290">{tx.roomTag}</text>

				<!-- a letter flying in, looping while the beat is about addresses on packets -->
				{#if s === 1 || s === 4}
					<g class="letter loop">
						<rect x="-10" y="-7" width="20" height="14" rx="2" />
						<polyline points="-10,-7 0,1 10,-7" />
					</g>
				{/if}

				<!-- the learner's own letter -->
				{#if s === 7 && shot}
					{#key shot.n}
						<g class="letter {shot.to === 'house' ? 'once' : 'lost'}">
							<rect x="-10" y="-7" width="20" height="14" rx="2" />
							<polyline points="-10,-7 0,1 10,-7" />
						</g>
						{#if shot.landed}
							{#if shot.to === 'house'}
								<g class="chip ok">
									<rect x="180" y="128" width="76" height="20" rx="10" />
									<text x="218" y="142">{tx.hitTag}</text>
								</g>
							{:else}
								<g class="chip bad">
									<rect x="78" y="150" width="96" height="20" rx="10" />
									<text x="126" y="164">{tx.lostTag}</text>
								</g>
							{/if}
						{/if}
					{/key}
				{/if}
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 1rem;
		}
	}
	.tryrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px 12px;
		min-height: 40px;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.tryrow.show {
		visibility: visible;
		opacity: 1;
	}
	.trylabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.trybtns {
		display: flex;
		gap: 8px;
	}
	.try {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 8px 14px;
		font-family: ui-monospace, monospace;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.try:hover,
	.try.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.try.pub:hover,
	.try.pub.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.art {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.lbl {
		fill: var(--color-faint);
		font-size: 12px;
		font-weight: 600;
		text-anchor: middle;
	}
	.roof {
		fill: var(--color-paper);
		stroke: var(--color-muted);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.wall {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
	}
	.inner {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.chip rect {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			fill 0.35s,
			stroke 0.35s;
	}
	.chip text {
		fill: var(--color-muted);
		font-family: ui-monospace, monospace;
		font-size: 11.5px;
		font-weight: 600;
		text-anchor: middle;
		transition: fill 0.35s;
	}
	.chip.priv.hi rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.chip.priv.hi text {
		fill: var(--color-brand);
	}
	.pubchip rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.pubchip text {
		fill: var(--color-grass);
		font-size: 13px;
	}
	.pubchip.hi rect {
		stroke-width: 2.2;
	}
	.pubchip.soft {
		opacity: 0.55;
	}
	.chip.ok rect {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.chip.ok text {
		fill: #fff;
		font-family: var(--font-sans);
	}
	.chip.bad rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.chip.bad text {
		fill: var(--color-danger);
		font-family: var(--font-sans);
	}
	.tag {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-anchor: middle;
		text-transform: uppercase;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.tag.show {
		opacity: 1;
	}
	.pubtag {
		fill: var(--color-grass);
	}
	.privtag {
		fill: var(--color-brand);
	}
	.fade {
		transition: opacity 0.6s ease;
	}
	.fade.gone {
		opacity: 0;
	}
	.letter rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.letter polyline {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.letter {
		opacity: 0;
	}
	.letter.loop {
		animation: deliver 3.6s ease-in-out infinite;
	}
	.letter.once {
		animation: deliver 2.4s ease-in-out 1 forwards;
	}
	.letter.lost {
		animation: lose 1.6s ease-in 1 forwards;
	}
	@keyframes deliver {
		0% {
			transform: translate(100px, 64px);
			opacity: 0;
		}
		8% {
			opacity: 1;
		}
		38% {
			transform: translate(287px, 117px);
		}
		66% {
			transform: translate(287px, 266px);
		}
		90% {
			transform: translate(218px, 214px);
			opacity: 1;
		}
		100% {
			transform: translate(218px, 214px);
			opacity: 0;
		}
	}
	@keyframes lose {
		0% {
			transform: translate(100px, 64px);
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		70% {
			transform: translate(126px, 132px) rotate(-8deg);
			opacity: 1;
		}
		100% {
			transform: translate(130px, 150px) rotate(-20deg);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tryrow,
		.fade,
		.tag,
		.chip rect,
		.chip text {
			transition: none;
		}
		.letter.loop,
		.letter.once,
		.letter.lost {
			animation: none;
			opacity: 0;
		}
		.letter.loop {
			transform: translate(287px, 117px);
			opacity: 1;
		}
	}
</style>
