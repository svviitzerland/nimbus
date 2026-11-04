<script lang="ts">
	// A guided Kubernetes lesson. A ship wheel (the control plane) watches three machines (nodes)
	// carrying little shipping containers (pods), next to the Deployment file that asks for five.
	// Following Nim, a pod crashes and nobody helps, then Kubernetes replaces a dead pod, then a
	// whole node fails and its pods are rebuilt elsewhere. On the last beat the learner may tap a
	// pod to knock it over and watch it come back.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { KubernetesText } from '$lib/chapters/devops/kubernetes/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as KubernetesText);

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

	const WANT = 5;
	const NODES = [0, 1, 2];
	const YAML = ['kind: Deployment', 'metadata:', '  name: nimbus-web', 'spec:', '  replicas: 5'];
	type Pod = { id: number; node: number; slot: number; dead: boolean; fresh: boolean };
	const START: [number, number][] = [
		[0, 0],
		[0, 1],
		[1, 0],
		[1, 1],
		[2, 0]
	];

	let pods = $state<Pod[]>([]);
	let up = $state([true, true, true]);
	let focus = $state<'plane' | 'node' | 'pod' | null>(null);
	let nextId = 1;

	function fresh() {
		nextId = 1;
		pods = START.map(([node, slot]) => ({ id: nextId++, node, slot, dead: false, fresh: false }));
		up = [true, true, true];
		focus = null;
	}
	fresh();

	const running = $derived(pods.filter((p) => !p.dead).length);

	function kill(id: number) {
		pods = pods.map((p) => (p.id === id ? { ...p, dead: true } : p));
	}
	function bury() {
		pods = pods.filter((p) => !p.dead);
	}
	/** Starts one new pod in a free slot, on the healthy node with the fewest pods. */
	function spawn() {
		const live = pods.filter((p) => !p.dead);
		if (live.length >= WANT) return;
		const nodes = NODES.filter((n) => up[n]).sort(
			(a, b) => live.filter((p) => p.node === a).length - live.filter((p) => p.node === b).length
		);
		for (const n of nodes) {
			const used = pods.filter((p) => p.node === n).map((p) => p.slot);
			const slot = [0, 1, 2].find((s) => !used.includes(s));
			if (slot !== undefined) {
				pods = [...pods, { id: nextId++, node: n, slot, dead: false, fresh: true }];
				return;
			}
		}
	}
	function heal(): SeqStep[] {
		const missing = WANT - pods.filter((p) => !p.dead).length;
		const out: SeqStep[] = [[900, bury]];
		for (let k = 0; k < missing; k++) out.push([800, spawn]);
		return out;
	}

	function play(s: number, still: boolean): (() => void) | undefined {
		fresh();
		if (s === 1) {
			if (still) {
				kill(3);
				return;
			}
			return runSeq(
				[
					[1800, fresh],
					[4200, () => kill(3)]
				],
				true
			);
		}
		if (s === 3) {
			if (still) return;
			return runSeq(
				[
					[1800, () => (focus = 'plane')],
					[1800, () => (focus = 'node')],
					[1800, () => (focus = 'pod')]
				],
				true
			);
		}
		if (s === 4) {
			if (still) return;
			return runSeq(
				[
					[1800, fresh],
					[1500, () => kill(3)],
					[
						900,
						() => {
							bury();
						}
					],
					[3200, spawn]
				],
				true
			);
		}
		if (s === 5) {
			if (still) {
				up = [true, true, false];
				pods = pods.filter((p) => p.node !== 2);
				spawn();
				return;
			}
			return runSeq(
				[
					[1800, fresh],
					[
						1100,
						() => {
							up = [true, true, false];
							pods = pods.map((p) => (p.node === 2 ? { ...p, dead: true } : p));
						}
					],
					[900, bury],
					[3000, spawn],
					[2400, () => (up = [true, true, true])]
				],
				true
			);
		}
	}

	$effect(() => {
		const s = step;
		const still = reduce;
		return untrack(() => play(s, still));
	});

	// the optional play, knock a pod over and let the control plane replace it
	let timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => {
		void step;
		return () => {
			timers.forEach(clearTimeout);
			timers = [];
		};
	});
	function tap(p: Pod) {
		if (step !== last || p.dead) return;
		kill(p.id);
		onstate?.('healed');
		const steps = heal();
		let at = reduce ? 0 : 600;
		for (const [ms, fn] of steps) {
			timers.push(setTimeout(fn, at));
			at += reduce ? 0 : ms;
		}
	}

	const k8sOn = $derived(step >= 2);
	const fixing = $derived(k8sOn && running < WANT);
	const nx = (n: number) => 14 + n * 150;
	const fill = (t: string) => t.replace('{w}', String(WANT)).replace('{r}', String(running));
</script>

{#snippet visual(i: number)}
	<div class="vis">
		<svg viewBox="0 0 460 286" class="scene" role="img" aria-label={tx.planeLabel}>
			<!-- the control plane, a ship wheel -->
			<g class="plane" class:off={!k8sOn} class:lit={focus === 'plane' || i === 6}>
				{#each NODES as n (n)}
					<line x1="104" y1="98" x2={nx(n) + 66} y2="168" class="wire" class:on={k8sOn} />
				{/each}
				<g class="wheel" class:spin={fixing && !reduce} class:turn={i === 6 && !reduce}>
					{#each [0, 45, 90, 135, 180, 225, 270, 315] as a (a)}
						<g transform="rotate({a} 104 58)">
							<line x1="104" y1="50" x2="104" y2="16" class="spoke" />
							<circle cx="104" cy="14" r="4.5" class="knob" />
						</g>
					{/each}
					<circle cx="104" cy="58" r="30" class="rim" />
					<circle cx="104" cy="58" r="8" class="hub" />
				</g>
				<text x="104" y="118" text-anchor="middle" class="cap-svg">{tx.planeLabel}</text>
			</g>

			<!-- the Deployment file -->
			<rect x="204" y="10" width="242" height="86" rx="9" class="card" />
			{#each YAML as l, n (n)}
				{#if n === 4}
					<rect
						x="210"
						y={18 + n * 14}
						width="120"
						height="15"
						rx="3"
						class="hl"
						class:on={i === 2 || i === 6}
					/>
				{/if}
				<text x="218" y={29 + n * 14} class="mono" class:key={n === 4}>{l}</text>
			{/each}

			<!-- what you want against what runs -->
			{#if i === 1}
				<text x="204" y="124" class="night">{tx.night}</text>
			{:else if k8sOn}
				<text x="204" y="124" class="readout" class:bad={running < WANT}>{fill(tx.readout)}</text>
				{#if i === 6}
					<text x="204" y="142" class="rule">{tx.rule}</text>
				{/if}
			{/if}

			<!-- the nodes -->
			{#each NODES as n (n)}
				{@const x = nx(n)}
				<g class="node" class:down={!up[n]} class:lit={focus === 'node'}>
					<rect {x} y="168" width="132" height="94" rx="9" class="body" />
					<path d="M{x} 190V177a9 9 0 0 1 9 -9H{x + 123}a9 9 0 0 1 9 9V190Z" class="head" />
					<circle cx={x + 14} cy="179" r="3.4" class="led" />
					<text x={x + 24} y="183" class="node-name"
						>{tx.nodeLabel.replace('{n}', String(n + 1))}</text
					>
					<line x1={x + 10} y1="252" x2={x + 122} y2="252" class="deck" />
				</g>
			{/each}

			<!-- the pods, little shipping containers -->
			{#each pods as p (p.id)}
				<g
					class="pod"
					class:dead={p.dead}
					class:fresh={p.fresh && !reduce}
					class:lit={focus === 'pod'}
					class:tap={i === last}
					style="transform: translate({nx(p.node) + 12 + p.slot * 40}px, 214px)"
					role="button"
					tabindex={i === last ? 0 : -1}
					aria-disabled={i !== last}
					aria-label={tx.podLabel}
					onclick={() => tap(p)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							tap(p);
						}
					}}
				>
					<g class="crate">
						<rect x="0" y="0" width="32" height="36" rx="3" class="box" />
						{#each [8, 16, 24] as rx (rx)}
							<line x1={rx} y1="5" x2={rx} y2="31" class="rib" />
						{/each}
					</g>
				</g>
			{/each}

			{#if i === last}
				<text x="230" y="282" text-anchor="middle" class="hint">{tx.tapHint}</text>
			{/if}
		</svg>
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
		justify-content: center;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}

	.plane {
		transition: opacity 0.5s;
	}
	.plane.off {
		opacity: 0.3;
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 1.6;
		transition: stroke 0.4s;
	}
	.wire.on {
		stroke: color-mix(in srgb, var(--color-brand) 45%, var(--color-line));
	}
	.wheel {
		transform-box: view-box;
		transform-origin: 104px 58px;
	}
	.wheel.spin {
		animation: spin 1.6s linear infinite;
	}
	.wheel.turn {
		animation: sway 4s ease-in-out infinite alternate;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes sway {
		from {
			transform: rotate(-25deg);
		}
		to {
			transform: rotate(25deg);
		}
	}
	.rim {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 6;
	}
	.spoke {
		stroke: var(--color-amber);
		stroke-width: 3.5;
		stroke-linecap: round;
	}
	.knob {
		fill: var(--color-amber);
	}
	.hub {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 3;
	}
	.plane.lit .rim,
	.plane.lit .spoke,
	.plane.lit .hub {
		stroke: var(--color-brand);
	}
	.plane.lit .knob {
		fill: var(--color-brand);
	}
	.cap-svg {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}

	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		white-space: pre;
		fill: var(--color-ink);
	}
	.mono.key {
		font-weight: 800;
		fill: var(--color-brand);
	}
	.hl {
		fill: var(--color-brand-soft);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.hl.on {
		opacity: 1;
	}
	.readout {
		font-size: 13px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.readout.bad {
		fill: var(--color-danger);
	}
	.night {
		font-size: 13px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.rule {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}

	.body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.4s,
			fill 0.4s;
	}
	.head {
		fill: var(--color-paper);
	}
	.led {
		fill: var(--color-grass);
	}
	.node-name {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.deck {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.node.lit .body {
		stroke: var(--color-brand);
	}
	.node.down .body {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.node.down .led {
		fill: var(--color-danger);
	}

	.pod {
		transition: transform 0.6s ease;
		outline: none;
	}
	.pod.tap {
		cursor: pointer;
	}
	.crate {
		transform-box: fill-box;
		transform-origin: center bottom;
		transition:
			transform 0.6s ease,
			opacity 0.6s ease;
	}
	.box {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.rib {
		stroke: var(--color-brand);
		stroke-width: 1.2;
		opacity: 0.45;
	}
	.pod.lit .box {
		stroke-width: 2.5;
	}
	.pod.tap:hover .box,
	.pod.tap:focus-visible .box {
		stroke: var(--color-ink);
	}
	.pod.dead .crate {
		transform: rotate(80deg) translateY(4px);
		opacity: 0.55;
	}
	.pod.dead .box {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.pod.dead .rib {
		stroke: var(--color-danger);
	}
	.pod.fresh .crate {
		animation: born 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}
	.pod.fresh .box {
		animation: glow 1.6s ease-out both;
	}
	@keyframes born {
		from {
			transform: scale(0.3);
			opacity: 0;
		}
	}
	@keyframes glow {
		from {
			fill: var(--color-grass-soft);
			stroke: var(--color-grass);
		}
	}
	.hint {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-brand);
	}

	@media (prefers-reduced-motion: reduce) {
		.plane,
		.wire,
		.hl,
		.body,
		.pod,
		.crate,
		.box {
			transition: none;
		}
		.wheel.spin,
		.wheel.turn {
			animation: none;
		}
	}
</style>
