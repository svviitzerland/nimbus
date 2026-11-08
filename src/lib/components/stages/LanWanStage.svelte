<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { LanWanText } from '$lib/chapters/network/lan-wan/types';
	import DeviceIcon, { type DeviceKind } from './netbasics/DeviceIcon.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as LanWanText);

	type Level = 'lan' | 'wan' | 'net';
	const LEVELS: Level[] = ['lan', 'wan', 'net'];
	const TOKEN: Record<Level, string> = { lan: 'lan', wan: 'wan', net: 'internet' };

	type Node = { x: number; y: number; kind: DeviceKind; label: string };
	type Scene = { hub: Node | null; nodes: Node[] };

	// Every level is the one before it, zoomed out. The room becomes the head office, and the
	// whole company becomes one network among many.
	const scenes = $derived<Record<Level, Scene>>({
		lan: {
			hub: { x: 160, y: 132, kind: 'switch', label: tx.switchLabel },
			nodes: [
				{ x: 58, y: 62, kind: 'laptop', label: tx.laptopLabel },
				{ x: 262, y: 62, kind: 'laptop', label: tx.laptopLabel },
				{ x: 62, y: 196, kind: 'pc', label: tx.pcLabel },
				{ x: 258, y: 196, kind: 'pc', label: tx.pcLabel }
			]
		},
		wan: {
			hub: { x: 160, y: 128, kind: 'building', label: tx.hqLabel },
			nodes: [
				{ x: 52, y: 52, kind: 'building', label: tx.branchLabel.replace('{n}', '1') },
				{ x: 268, y: 52, kind: 'building', label: tx.branchLabel.replace('{n}', '2') },
				{ x: 160, y: 206, kind: 'building', label: tx.branchLabel.replace('{n}', '3') }
			]
		},
		net: {
			hub: null,
			nodes: [
				{ x: 66, y: 76, kind: 'building', label: tx.nets[0] },
				{ x: 166, y: 40, kind: 'router', label: tx.nets[1] },
				{ x: 266, y: 80, kind: 'phone', label: tx.nets[2] },
				{ x: 254, y: 186, kind: 'server', label: tx.nets[3] },
				{ x: 156, y: 206, kind: 'laptop', label: tx.nets[4] },
				{ x: 56, y: 186, kind: 'globe', label: tx.nets[5] }
			]
		}
	});

	let level = $state<Level>('lan');
	// Which nodes are wired at the current level. On the world level, your company starts joined.
	let wired = $state<boolean[]>([false, false, false, false]);
	// World level links, as pairs of node indices.
	let links = $state<[number, number][]>([]);
	let finished = $state(false);
	let completed = false;

	const scene = $derived(scenes[level]);
	const levelDone = $derived(wired.length > 0 && wired.every(Boolean));
	const levelIndex = $derived(LEVELS.indexOf(level));

	function go(l: Level) {
		level = l;
		const count = scenes[l].nodes.length;
		wired = Array.from({ length: count }, (_, i) => l === 'net' && i === 0);
		links = [];
	}

	function tap(i: number) {
		if (wired[i]) return;
		if (level === 'net') {
			// Join the two nearest networks that are already in, there is no center to plug into.
			const nodes = scene.nodes;
			const joined = nodes
				.map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
				.filter((o) => wired[o.j])
				.sort((a, b) => a.d - b.d)
				.slice(0, 2);
			links = [...links, ...joined.map((o): [number, number] => [o.j, i])];
		}
		wired[i] = true;
		if (wired.every(Boolean)) {
			onstate?.(TOKEN[level]);
			if (level === 'net') {
				finished = true;
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
		}
	}

	function zoomOut() {
		if (level === 'lan') go('wan');
		else if (level === 'wan') go('net');
	}
	function restart() {
		finished = false;
		go('lan');
	}

	function onKey(e: KeyboardEvent, i: number) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			tap(i);
		}
	}

	const caption = $derived(levelDone ? tx.levels[level].done : tx.levels[level].hint);
</script>

<div class="flex h-full w-full flex-col items-center gap-3">
	<!-- the three scales, then the action -->
	<div class="steps">
		{#each LEVELS as l, i (l)}
			<span class="step" class:on={l === level} class:past={i < levelIndex}>
				<b>{tx.levels[l].tab}</b>
				<span>{tx.levels[l].scope}</span>
			</span>
		{/each}
	</div>

	<div class="actions">
		{#if levelDone && level !== 'net'}
			<button type="button" class="cta" onclick={zoomOut}>{tx.zoomBtn}</button>
		{:else if finished}
			<button type="button" class="line" onclick={restart}>{tx.againBtn}</button>
		{/if}
	</div>

	{#key level}
		<svg class="board" viewBox="0 0 320 250" role="group" aria-label={tx.levels[level].tab}>
			<!-- the boundary of this level -->
			{#if level === 'lan'}
				<rect x="10" y="14" width="300" height="226" rx="18" class="room" />
			{:else if level === 'wan'}
				<rect x="10" y="14" width="300" height="226" rx="40" class="city" />
			{:else}
				<ellipse cx="160" cy="127" rx="152" ry="114" class="world" />
			{/if}

			<!-- the cables -->
			{#if scene.hub}
				{#each scene.nodes as n, i (i)}
					{#if wired[i]}
						<line
							x1={scene.hub.x}
							y1={scene.hub.y}
							x2={n.x}
							y2={n.y}
							class="wire"
							class:long={level === 'wan'}
						/>
					{/if}
				{/each}
			{:else}
				{#each links as [a, b] (a + '-' + b)}
					<line
						x1={scene.nodes[a].x}
						y1={scene.nodes[a].y}
						x2={scene.nodes[b].x}
						y2={scene.nodes[b].y}
						class="wire long"
					/>
				{/each}
			{/if}

			<!-- the hub in the middle -->
			{#if scene.hub}
				<g class="node hub">
					<circle cx={scene.hub.x} cy={scene.hub.y} r="22" class="disc" />
					<g transform="translate({scene.hub.x - 13} {scene.hub.y - 13})" class="ic on">
						<DeviceIcon kind={scene.hub.kind} size={26} />
					</g>
					<text x={scene.hub.x} y={scene.hub.y + 36} class="lbl strong">{scene.hub.label}</text>
				</g>
			{/if}

			<!-- the things to wire -->
			{#each scene.nodes as n, i (i)}
				<g
					class="node tap"
					class:wired={wired[i]}
					role="button"
					tabindex={wired[i] ? -1 : 0}
					aria-label={n.label}
					aria-pressed={wired[i]}
					onclick={() => tap(i)}
					onkeydown={(e) => onKey(e, i)}
				>
					<circle cx={n.x} cy={n.y} r="22" class="disc" />
					<g transform="translate({n.x - 12} {n.y - 12})" class="ic" class:on={wired[i]}>
						<DeviceIcon kind={n.kind} size={24} />
					</g>
					<text x={n.x} y={n.y + 35} class="lbl">{n.label}</text>
				</g>
			{/each}
		</svg>
	{/key}

	<p class="note">{caption}</p>
</div>

<style>
	.steps {
		display: flex;
		gap: 6px;
	}
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 84px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 10px;
		line-height: 1.2;
		color: var(--color-faint);
		transition:
			border-color 0.25s ease,
			color 0.25s ease;
	}
	.step b {
		font-size: 12px;
		font-weight: 800;
	}
	.step span {
		font-size: 9.5px;
		font-weight: 600;
	}
	.step.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.step.past {
		color: var(--color-grass);
	}
	.actions {
		display: flex;
		min-height: 40px;
		align-items: center;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		animation: pop 0.3s ease;
	}
	.line {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 16px;
		font-size: 13px;
		font-weight: 600;
	}
	.line:hover {
		border-color: var(--color-ink);
	}

	.board {
		width: min(94vw, 360px);
		height: auto;
		overflow: visible;
		animation: zoom 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(1.7);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.room,
	.city,
	.world {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.city {
		fill: color-mix(in srgb, var(--color-amber) 7%, var(--color-card));
	}
	.world {
		fill: var(--color-brand-soft);
		stroke: none;
	}
	.wire {
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
		animation: fadein 0.35s ease;
	}
	.wire.long {
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
	}
	.disc {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.2s ease;
	}
	.hub .disc {
		stroke: var(--color-brand);
	}
	.node.tap {
		cursor: pointer;
		outline: none;
	}
	.node.tap:not(.wired):hover .disc,
	.node.tap:focus-visible .disc {
		stroke: var(--color-ink);
	}
	.node.tap:not(.wired) .disc {
		animation: breathe 1.8s ease-in-out infinite;
	}
	@keyframes breathe {
		50% {
			stroke: var(--color-amber);
		}
	}
	.node.wired .disc {
		stroke: var(--color-grass);
	}
	.ic {
		color: var(--color-faint);
		transition: color 0.2s ease;
	}
	.ic.on {
		color: var(--color-ink);
	}
	.lbl {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		paint-order: stroke;
		stroke: var(--color-card);
		stroke-width: 3px;
		stroke-linejoin: round;
	}
	.lbl.strong {
		fill: var(--color-brand);
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.85);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.board,
		.wire,
		.cta {
			animation: none;
		}
		.node.tap:not(.wired) .disc {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.board {
			width: 460px;
		}
		.step {
			min-width: 104px;
		}
		.step b {
			font-size: 13px;
		}
		.step span {
			font-size: 10.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
