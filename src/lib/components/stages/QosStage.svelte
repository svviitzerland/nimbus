<script lang="ts">
	// Guided QoS lesson. Three kinds of traffic (a video call, a game, a big download) feed one
	// router, whose waiting line drains into a narrow office line. The line moves by itself. While
	// QoS is off it is first come, first served; once QoS is on, call and game packets slip to the
	// front. The only (optional) play is switching QoS off and on at the last beat.
	import { onMount, untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import NgLaptop from './netguide/NgLaptop.svelte';
	import { prefersReducedMotion } from './netguide/motion';
	import type { StageProps } from '$lib/chapters/types';
	import type { QosText } from '$lib/chapters/network/qos/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as QosText);

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

	let userOff = $state(false);
	function toggle() {
		userOff = !userOff;
		onstate?.(userOff ? 'qosOff' : 'qosOn');
	}
	const qos = $derived(shown >= 3 && !(shown === last && userOff));

	type Kind = 'call' | 'game' | 'dl';
	type Pk = { id: number; kind: Kind };
	const TONE: Record<Kind, string> = {
		call: 'var(--color-grass)',
		game: 'var(--color-brand)',
		dl: 'var(--color-amber)'
	};
	// The traffic mix arriving at the router, mostly download chunks with a few urgent packets.
	const PATTERN: Kind[] = [
		'dl',
		'dl',
		'call',
		'dl',
		'dl',
		'game',
		'dl',
		'call',
		'dl',
		'dl',
		'dl',
		'call',
		'game',
		'dl'
	];
	const SLOTS = 8;
	const HEAD_X = 236;
	const GAP = 27.5;
	const LANE_Y = 190;

	let nextId = 0;
	let cursor = 0;
	const arrive = (): Pk => {
		const kind = PATTERN[cursor % PATTERN.length];
		cursor += 1;
		return { id: nextId++, kind };
	};
	const urgentFirst = (q: Pk[]) => [
		...q.filter((p) => p.kind !== 'dl'),
		...q.filter((p) => p.kind === 'dl')
	];

	// queue[0] is the head, the next packet to leave through the office line.
	let queue = $state<Pk[]>(Array.from({ length: SLOTS }, arrive));
	let leaving = $state<Pk | null>(null);

	// When QoS switches on, the waiting line is sorted at once, so urgent packets visibly slip forward.
	$effect(() => {
		if (qos) queue = urgentFirst(untrack(() => queue));
	});

	function tick() {
		const [head, ...rest] = queue;
		leaving = head;
		const fresh = arrive();
		if (qos && fresh.kind !== 'dl') {
			const firstDl = rest.findIndex((p) => p.kind === 'dl');
			const at = firstDl === -1 ? rest.length : firstDl;
			queue = [...rest.slice(0, at), fresh, ...rest.slice(at)];
		} else queue = [...rest, fresh];
	}

	$effect(() => {
		if (prefersReducedMotion()) return;
		const id = setInterval(tick, 950);
		return () => clearInterval(id);
	});

	const SOURCES: { kind: Kind; x: number }[] = [
		{ kind: 'call', x: 64 },
		{ kind: 'game', x: 150 },
		{ kind: 'dl', x: 236 }
	];
	const lineHot = $derived(shown === 1);
	const callHot = $derived(shown === 2 || shown === 3);
</script>

<div class="stage">
	<div class="actions">
		{#if shown === last}
			<button type="button" class="play" class:on={!userOff} onclick={toggle}>
				{userOff ? tx.onBtn : tx.offBtn}
			</button>
		{/if}
	</div>

	<Guide
		steps={tx.steps}
		active={shown}
		onselect={(k) => (peek = k)}
		accent={qos ? 'var(--color-grass)' : 'var(--color-brand)'}
	>
		{#snippet visual()}
			<svg viewBox="0 0 340 320" class="scene" role="img" aria-label={tx.title}>
				<!-- the three senders and their cables into the router -->
				{#each SOURCES as s, i (s.kind)}
					<line x1={s.x} y1="86" x2={s.x} y2="150" class="feed" style="stroke: {TONE[s.kind]}" />
					<g transform="translate({s.x} 48)">
						{#if s.kind === 'call'}
							<NgLaptop x={0} y={0} tone={TONE.call} />
							<circle cx="0" cy="-5" r="4" fill={TONE.call} />
							<path d="M-7 4 a7 6 0 0 1 14 0" fill={TONE.call} />
						{:else if s.kind === 'game'}
							<rect
								x="-22"
								y="-12"
								width="44"
								height="26"
								rx="13"
								fill="var(--color-card)"
								stroke="var(--color-ink)"
								stroke-width="2"
							/>
							<path
								d="M-12 1 h8 M-8 -3 v8"
								stroke={TONE.game}
								stroke-width="2.6"
								stroke-linecap="round"
							/>
							<circle cx="8" cy="-1" r="2.6" fill={TONE.game} />
							<circle cx="14" cy="4" r="2.6" fill={TONE.game} />
						{:else}
							<circle r="17" fill="var(--color-card)" stroke="var(--color-ink)" stroke-width="2" />
							<path
								d="M0 -9 v14 M-6 0 l6 6 l6 -6"
								fill="none"
								stroke={TONE.dl}
								stroke-width="2.6"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						{/if}
						<text y="34" text-anchor="middle" class="src-t">{tx.flows[i]}</text>
					</g>
				{/each}

				<!-- the router with its waiting line -->
				<rect x="20" y="150" width="244" height="72" rx="14" class="router" />
				<text x="32" y="167" class="r-t">{tx.routerLabel}</text>
				<g class="chip" class:on={qos}>
					<rect x="190" y="156" width="64" height="16" rx="8" />
					<text x="222" y="167.5" text-anchor="middle">{qos ? tx.qosOn : tx.qosOff}</text>
				</g>

				<!-- the narrow office line out to the internet -->
				<rect x="264" y="181" width="66" height="18" rx="4" class="line" class:hot={lineHot} />
				<text x="297" y="216" text-anchor="middle" class="src-t">{tx.lineLabel}</text>

				{#each queue as p, i (p.id)}
					<rect
						x="-10"
						y="-9"
						width="20"
						height="18"
						rx="4"
						class="pk"
						class:hot={callHot && p.kind === 'call'}
						style="fill: {TONE[p.kind]}; transform: translate({HEAD_X - i * GAP}px, {LANE_Y}px)"
					/>
				{/each}
				{#if leaving}
					{#key leaving.id}
						<rect
							x="-8"
							y="-7"
							width="16"
							height="14"
							rx="3"
							class="out"
							style="fill: {TONE[leaving.kind]}"
						/>
					{/key}
				{/if}

				<!-- how the video call feels right now -->
				<g transform="translate(70 258)">
					<rect width="200" height="40" rx="12" class="card" />
					<circle
						cx="20"
						cy="20"
						r="6"
						fill={qos ? 'var(--color-grass)' : 'var(--color-danger)'}
						class:blink={!qos}
					/>
					<text x="34" y="24.5" class="card-t">{tx.callStatus}</text>
					<text x="186" y="24.5" text-anchor="end" class="card-s" class:bad={!qos}>
						{qos ? tx.smooth : tx.stutter}
					</text>
				</g>
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
		justify-content: center;
	}
	.play {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 8px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.08);
	}
	.play:not(.on) {
		border-color: var(--color-grass);
		color: var(--color-grass);
	}
	.scene {
		width: 100%;
		max-width: 400px;
		overflow: visible;
	}
	.feed {
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.45;
	}
	.src-t {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.router {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.6;
	}
	.r-t {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.chip rect {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.chip text {
		fill: var(--color-faint);
		font-size: 9px;
		font-weight: 800;
	}
	.chip.on rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.chip.on text {
		fill: var(--color-grass);
	}
	.line {
		fill: var(--color-paper);
		stroke: var(--color-faint);
		stroke-width: 1.6;
		transition: stroke 0.4s;
	}
	.line.hot {
		stroke: var(--color-amber);
		stroke-width: 2.4;
	}
	.pk {
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.pk.hot {
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.out {
		animation: out 0.9s ease-in forwards;
	}
	@keyframes out {
		from {
			transform: translate(258px, 190px);
			opacity: 1;
		}
		to {
			transform: translate(336px, 190px);
			opacity: 0;
		}
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.card-t {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 700;
	}
	.card-s {
		fill: var(--color-grass);
		font-size: 12px;
		font-weight: 800;
	}
	.card-s.bad {
		fill: var(--color-danger);
	}
	.blink {
		animation: blink 1.1s steps(2, start) infinite;
	}
	@keyframes blink {
		to {
			opacity: 0.25;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pk {
			transition: none;
		}
		.out {
			animation: none;
			opacity: 0;
		}
		.blink {
			animation: none;
		}
	}
</style>
