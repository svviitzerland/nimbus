<script lang="ts">
	// Guided protocols lesson. The nimbus.com server is drawn as a building with four numbered
	// doors (80 HTTP, 443 HTTPS, 22 SSH, 53 DNS). As Nim names each protocol, a packet walks from
	// the laptop to its door by itself and the door opens on what lives behind it. The only
	// (optional) play is tapping a door on the last beat to send a knock there.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import NgLaptop from './netguide/NgLaptop.svelte';
	import { Traveller } from './netguide/traveller.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ProtocolsText } from '$lib/chapters/network/protocols/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ProtocolsText);

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const shown = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	const DOORS = [
		{ id: 'http', port: 80, cx: 176, top: 96, tone: 'var(--color-amber)' },
		{ id: 'https', port: 443, cx: 274, top: 96, tone: 'var(--color-grass)' },
		{ id: 'ssh', port: 22, cx: 176, top: 214, tone: 'var(--color-brand)' },
		{ id: 'dns', port: 53, cx: 274, top: 214, tone: 'var(--color-brand)' }
	] as const;
	const DW = 58;
	const DH = 62;
	const LAP = { x: 54, y: 252 };

	let knock = $state<number | null>(null);
	function knockOn(d: number) {
		if (shown !== last) return;
		knock = d;
		onstate?.(DOORS[d].id);
	}

	// Which door is in focus on this step, if any.
	const target = $derived(shown >= 2 && shown <= 5 ? shown - 2 : shown === last ? knock : null);

	const plan = $derived.by(() => {
		if (target === null) return [] as { x: number; y: number }[];
		const d = DOORS[target];
		return [
			{ x: LAP.x, y: LAP.y - 34 },
			{ x: 108, y: 180 },
			{ x: d.cx, y: d.top + DH / 2 }
		];
	});

	const tr = new Traveller();
	$effect(() => {
		tr.play(plan.length, { loop: true, step: 850, hold: 2600 });
		return () => tr.stop();
	});
	const pkt = $derived(plan.length ? plan[Math.min(tr.at, plan.length - 1)] : null);
	const isOpen = (d: number) => (target === d && tr.ended && plan.length > 0) || shown === 6;
	const plateLit = (d: number) => shown === 1 || shown === 6 || target === d;
</script>

<div class="stage">
	<div class="actions">
		{#if shown === last && knock === null}
			<span class="hint">{tx.knockHint}</span>
		{/if}
	</div>

	<Guide
		steps={tx.steps}
		active={shown}
		onselect={(k) => (peek = k)}
		accent={target !== null ? DOORS[target].tone : 'var(--color-brand)'}
	>
		{#snippet visual()}
			<svg viewBox="0 0 340 320" class="scene" role="img" aria-label={tx.title}>
				<!-- the server, drawn as a building -->
				<rect x="122" y="26" width="206" height="288" rx="16" class="building" />
				<text x="225" y="47" text-anchor="middle" class="b-name">{tx.serverLabel}</text>
				<text x="225" y="61" text-anchor="middle" class="b-sub">{tx.serverSub}</text>

				{#each DOORS as d, i (d.id)}
					{@const x = d.cx - DW / 2}
					{@const open = isOpen(i)}
					<g
						class="door"
						class:tappable={shown === last}
						role="button"
						tabindex={shown === last ? 0 : -1}
						aria-disabled={shown !== last}
						aria-label={tx.doorAria
							.replace('{name}', tx.doors[i].name)
							.replace('{port}', String(d.port))}
						onclick={() => knockOn(i)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								knockOn(i);
							}
						}}
						style="--tone: {d.tone}"
					>
						<!-- what lives behind the door -->
						<rect {x} y={d.top} width={DW} height={DH} rx="5" class="inside" class:open />
						<g transform="translate({d.cx} {d.top + DH / 2})" class="glyph" class:open>
							{#if d.id === 'http' || d.id === 'https'}
								<rect x="-11" y="-14" width="22" height="26" rx="2.5" class="g-fill" />
								<rect x="-7" y="-9" width="14" height="2.4" rx="1.2" class="g-line" />
								<rect x="-7" y="-4" width="10" height="2.4" rx="1.2" class="g-line" />
								{#if d.id === 'https'}
									<rect x="-1" y="2" width="14" height="11" rx="2" class="g-lock" />
									<path d="M2 2 v-3 a4 4 0 0 1 8 0 v3" fill="none" class="g-shackle" />
								{/if}
							{:else if d.id === 'ssh'}
								<rect x="-15" y="-12" width="30" height="24" rx="3" class="g-term" />
								<text x="-10" y="4" class="g-prompt">&gt;_</text>
							{:else}
								<rect x="-12" y="-13" width="24" height="26" rx="2.5" class="g-fill" />
								<line x1="-6" y1="-13" x2="-6" y2="13" class="g-spine" />
								<text x="3" y="4" text-anchor="middle" class="g-at">@</text>
							{/if}
						</g>
						<!-- the door itself, it swings open when a packet knocks -->
						<rect {x} y={d.top} width={DW} height={DH} rx="5" class="panel" class:open />
						<circle cx={x + DW - 9} cy={d.top + DH / 2 + 4} r="2.4" class="knob" class:open />
						<!-- the number plate and the name -->
						<g class="plate" class:lit={plateLit(i)}>
							<rect x={d.cx - 20} y={d.top - 22} width="40" height="18" rx="9" />
							<text x={d.cx} y={d.top - 9} text-anchor="middle">{d.port}</text>
						</g>
						<text x={d.cx} y={d.top + DH + 15} text-anchor="middle" class="d-name">
							{tx.doors[i].name}
						</text>
						<text x={d.cx} y={d.top + DH + 27} text-anchor="middle" class="d-use">
							{tx.doors[i].use}
						</text>
					</g>
				{/each}

				<NgLaptop x={LAP.x} y={LAP.y} label={tx.laptopLabel} />

				{#if pkt && target !== null}
					<g
						class="packet"
						class:jump={tr.jump}
						class:gone={tr.hidden}
						style="transform: translate({pkt.x}px, {pkt.y}px); --tone: {DOORS[target].tone}"
					>
						<rect x="-12" y="-8" width="24" height="16" rx="3" class="env" />
						<path d="M-12 -7 L0 2 L12 -7" fill="none" class="flap" />
						{#if DOORS[target].id === 'https'}
							<rect x="6" y="2" width="10" height="8" rx="1.6" class="mini-lock" />
						{/if}
					</g>
				{/if}
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.stage {
			padding-bottom: 1.5rem;
		}
	}
	.actions {
		display: flex;
		min-height: 38px;
		align-items: center;
		justify-content: center;
	}
	.hint {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.scene {
		width: 100%;
		max-width: 400px;
		overflow: visible;
	}
	.building {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.6;
	}
	.b-name {
		fill: var(--color-ink);
		font-size: 13px;
		font-weight: 800;
	}
	.b-sub {
		fill: var(--color-faint);
		font-size: 10px;
		font-family: ui-monospace, monospace;
	}
	.door {
		outline: none;
	}
	.door.tappable {
		cursor: pointer;
	}
	.door.tappable:focus-visible .panel {
		stroke: var(--color-brand);
		stroke-width: 2.4;
	}
	.inside {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.4;
		transition: fill 0.4s;
	}
	.inside.open {
		fill: color-mix(in srgb, var(--tone) 14%, var(--color-card));
	}
	.glyph {
		opacity: 0;
		transition: opacity 0.4s 0.25s;
	}
	.glyph.open {
		opacity: 1;
	}
	.g-fill {
		fill: var(--color-card);
		stroke: var(--tone);
		stroke-width: 1.6;
	}
	.g-line {
		fill: var(--tone);
		opacity: 0.6;
	}
	.g-lock {
		fill: var(--color-grass);
	}
	.g-shackle {
		stroke: var(--color-grass);
		stroke-width: 1.8;
	}
	.g-term {
		fill: var(--color-ink);
	}
	.g-prompt {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
		font-family: ui-monospace, monospace;
	}
	.g-spine {
		stroke: var(--tone);
		stroke-width: 1.6;
	}
	.g-at {
		fill: var(--tone);
		font-size: 12px;
		font-weight: 800;
	}
	.panel {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.6;
		transform-box: fill-box;
		transform-origin: 0 50%;
		transition: transform 0.55s cubic-bezier(0.3, 0.9, 0.4, 1);
	}
	.panel.open {
		transform: scaleX(0.14);
	}
	.knob {
		fill: var(--color-faint);
		transition: opacity 0.2s;
	}
	.knob.open {
		opacity: 0;
	}
	.plate rect {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.plate text {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 800;
		transition: fill 0.3s;
	}
	.plate.lit rect {
		fill: color-mix(in srgb, var(--tone) 16%, var(--color-card));
		stroke: var(--tone);
	}
	.plate.lit text {
		fill: var(--tone);
	}
	.d-name {
		fill: var(--color-ink);
		font-size: 11px;
		font-weight: 800;
	}
	.d-use {
		fill: var(--color-faint);
		font-size: 9px;
		font-weight: 600;
	}
	.packet {
		transition:
			transform 0.8s cubic-bezier(0.45, 0, 0.25, 1),
			opacity 0.25s;
	}
	.packet.jump {
		transition: opacity 0.25s;
	}
	.packet.gone {
		opacity: 0;
	}
	.env {
		fill: var(--tone);
	}
	.flap {
		stroke: var(--color-card);
		stroke-width: 1.6;
	}
	.mini-lock {
		fill: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.panel,
		.glyph,
		.packet,
		.inside,
		.plate rect,
		.plate text {
			transition: none;
		}
	}
</style>
