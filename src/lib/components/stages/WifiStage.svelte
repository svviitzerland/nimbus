<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { WifiText } from '$lib/chapters/network/wifi/types';
	import DeviceIcon from './netbasics/DeviceIcon.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WifiText);

	// ---- The house plan, 20 units to a metre ----
	const W = 300;
	const H = 250;
	const UNIT = 20;
	type Seg = [number, number, number, number];
	const WALLS: Seg[] = [
		// outside walls, with the front door in the bottom one
		[10, 10, 290, 10],
		[10, 10, 10, 200],
		[290, 10, 290, 200],
		[10, 200, 120, 200],
		[150, 200, 290, 200],
		// the middle wall, with a doorway
		[150, 10, 150, 70],
		[150, 100, 150, 200],
		// left rooms, living room above the bedroom
		[10, 115, 60, 115],
		[90, 115, 150, 115],
		// right rooms, kitchen above the study
		[150, 105, 220, 105],
		[250, 105, 290, 105]
	];
	const ROOM_POS = [
		{ x: 80, y: 26 },
		{ x: 220, y: 26 },
		{ x: 80, y: 190 },
		{ x: 220, y: 190 },
		{ x: 70, y: 236 }
	];
	const ROUTER = { x: 46, y: 50 };
	const NEIGHBOUR = { x: 262, y: 228 };
	const NEIGHBOUR_CH = 6;

	function crosses(ax: number, ay: number, bx: number, by: number, s: Seg) {
		const [cx, cy, dx, dy] = s;
		const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
		if (d === 0) return false;
		const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d;
		const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
		return t > 0 && t < 1 && u >= 0 && u <= 1;
	}

	// ---- Radio, a simple feel for how bands behave ----
	type Band = 'b24' | 'b5';
	let band = $state<Band>('b5');
	let channel = $state(1);
	let phone = $state({ x: 96, y: 72 });

	const metres = $derived(Math.hypot(phone.x - ROUTER.x, phone.y - ROUTER.y) / UNIT);
	const walls = $derived(
		WALLS.filter((s) => crosses(ROUTER.x, ROUTER.y, phone.x, phone.y, s)).length
	);
	function speedOf(b: Band, d: number, w: number, ch: number) {
		const s = b === 'b5' ? 100 - 5 * d - 30 * w : 100 - 3 * d - 12 * w;
		if (s <= 6) return 0;
		const max = b === 'b5' ? 600 : 150;
		const clash = b === 'b24' && ch === NEIGHBOUR_CH ? 0.4 : 1;
		return Math.round(max * Math.pow(s / 100, 1.5) * clash);
	}
	const speed = $derived(speedOf(band, metres, walls, channel));
	const speed5Here = $derived(speedOf('b5', metres, walls, channel));
	const bars = $derived(speed === 0 ? 0 : speed < 30 ? 1 : speed < 90 ? 2 : speed < 250 ? 3 : 4);
	const WEAK = 30;

	// ---- What Nim says, only when the situation changes ----
	let last = '';
	let goals = $state([false, false, false]);
	let completed = false;

	function evaluate() {
		let token = '';
		if (band === 'b24' && channel === NEIGHBOUR_CH) token = 'clash';
		else if (band === 'b5') {
			if (speed < WEAK) token = 'weak5';
			else if (walls === 0 && speed >= 250) token = 'near5';
		} else if (speed5Here < WEAK && speed >= 20) token = 'through24';
		else if (last === 'clash') token = 'clear';

		if (token === 'weak5') goals[0] = true;
		if (token === 'through24') goals[1] = true;
		if (token === 'clash') goals[2] = true;

		if (token && token !== last) onstate?.(token);
		if (token) last = token;
		if (goals.every(Boolean) && !completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function setBand(b: Band) {
		band = b;
		evaluate();
	}
	function setChannel(c: number) {
		channel = c;
		evaluate();
	}

	// ---- Moving the phone ----
	let plan = $state<HTMLButtonElement | null>(null);
	let dragging = false;
	const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

	function moveTo(e: PointerEvent) {
		if (!plan) return;
		const r = plan.getBoundingClientRect();
		phone = {
			x: clamp(((e.clientX - r.left) / r.width) * W, 16, W - 16),
			y: clamp(((e.clientY - r.top) / r.height) * H, 16, H - 12)
		};
	}
	function down(e: PointerEvent) {
		dragging = true;
		plan?.setPointerCapture(e.pointerId);
		moveTo(e);
	}
	function move(e: PointerEvent) {
		if (dragging) moveTo(e);
	}
	function up() {
		if (!dragging) return;
		dragging = false;
		evaluate();
	}
	function key(e: KeyboardEvent) {
		const step = 10;
		const d: Record<string, [number, number]> = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, -step],
			ArrowDown: [0, step]
		};
		const m = d[e.key];
		if (!m) return;
		e.preventDefault();
		phone = {
			x: clamp(phone.x + m[0], 16, W - 16),
			y: clamp(phone.y + m[1], 16, H - 12)
		};
		evaluate();
	}

	const wallText = $derived(
		walls === 0
			? tx.walls.none
			: walls === 1
				? tx.walls.one
				: tx.walls.many.replace('{n}', String(walls))
	);
	const quality = $derived(
		speed === 0 ? 'none' : speed < WEAK ? 'weak' : speed < 90 ? 'ok' : 'good'
	);
	// The coverage rings, bigger for the band that reaches further.
	const rings = $derived(band === 'b24' ? [70, 140, 210] : [45, 90, 135]);
</script>

<div class="flex h-full w-full flex-col items-center gap-2.5">
	<!-- controls up top -->
	<div class="controls">
		<div class="group">
			<span class="glabel">{tx.bandLabel}</span>
			<div class="seg">
				{#each ['b24', 'b5'] as const as b (b)}
					<button
						type="button"
						class="opt"
						class:on={band === b}
						aria-pressed={band === b}
						onclick={() => setBand(b)}
					>
						<b>{tx.bands[b].name}</b>
						<span>{tx.bands[b].sub}</span>
					</button>
				{/each}
			</div>
		</div>
		<div class="group">
			<span class="glabel">{tx.channelLabel}</span>
			{#if band === 'b24'}
				<div class="chs">
					{#each [1, 6, 11] as c (c)}
						<button
							type="button"
							class="ch"
							class:on={channel === c}
							class:busy={c === NEIGHBOUR_CH}
							aria-pressed={channel === c}
							onclick={() => setChannel(c)}>{c}</button
						>
					{/each}
				</div>
			{:else}
				<span class="ch5">{tx.channel5Note}</span>
			{/if}
		</div>
	</div>

	<!-- the readout -->
	<div class="readout {quality}">
		<span class="bars" aria-hidden="true">
			{#each [1, 2, 3, 4] as i (i)}
				<i class:lit={bars >= i} style="height:{i * 4 + 2}px"></i>
			{/each}
		</span>
		<b>{speed === 0 ? tx.noSignal : `${speed} Mbps`}</b>
		<span class="walls">{wallText}</span>
	</div>

	<!-- the house plan; drag the phone or tap a spot -->
	<button
		type="button"
		class="plan"
		bind:this={plan}
		aria-label={tx.dragHint}
		onpointerdown={down}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
		onkeydown={key}
	>
		<svg viewBox="0 0 {W} {H}" aria-hidden="true">
			<rect x="10" y="10" width="280" height="190" class="floor" />
			<rect x="10" y="200" width="280" height="44" class="garden" />

			<!-- coverage rings around the router -->
			{#each rings as r (r)}
				<circle cx={ROUTER.x} cy={ROUTER.y} {r} class="ring {band}" />
			{/each}

			{#each WALLS as s, i (i)}
				<line x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} class="wall" />
			{/each}

			{#each ROOM_POS as p, i (i)}
				<text x={p.x} y={p.y} class="room">{tx.rooms[i]}</text>
			{/each}

			<!-- the radio path to the phone -->
			<line x1={ROUTER.x} y1={ROUTER.y} x2={phone.x} y2={phone.y} class="ray {quality}" />

			<!-- the neighbour, sharing the air -->
			<g class="nb" class:clash={band === 'b24' && channel === NEIGHBOUR_CH}>
				<g transform="translate({NEIGHBOUR.x - 10} {NEIGHBOUR.y - 16})">
					<DeviceIcon kind="router" size={20} />
				</g>
				<text x={NEIGHBOUR.x} y={NEIGHBOUR.y + 13} class="tag"
					>{tx.neighbourLabel.replace('{n}', String(NEIGHBOUR_CH))}</text
				>
			</g>

			<g class="rt">
				<g transform="translate({ROUTER.x - 12} {ROUTER.y - 14})">
					<DeviceIcon kind="router" size={24} />
				</g>
				<text x={ROUTER.x} y={ROUTER.y + 20} class="tag strong">{tx.routerLabel}</text>
			</g>

			<g class="ph">
				<circle cx={phone.x} cy={phone.y} r="15" class="halo {quality}" />
				<g transform="translate({phone.x - 11} {phone.y - 11})">
					<DeviceIcon kind="phone" size={22} />
				</g>
			</g>
		</svg>
	</button>

	<!-- the three goals -->
	<div class="goals">
		{#each tx.goals as g, i (i)}
			<span class="goal" class:met={goals[i]}>{goals[i] ? '✓' : i + 1} {g}</span>
		{/each}
	</div>
</div>

<style>
	.controls {
		display: flex;
		width: min(94vw, 360px);
		gap: 10px;
	}
	.group {
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column;
		gap: 4px;
	}
	.glabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.seg {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
	}
	.opt {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 4px;
		line-height: 1.15;
		color: var(--color-muted);
		transition: border-color 0.2s ease;
	}
	.opt b {
		font-size: 12px;
		font-weight: 800;
		white-space: nowrap;
	}
	.opt span {
		font-size: 8.5px;
		font-weight: 600;
	}
	.opt.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.chs {
		display: flex;
		gap: 4px;
	}
	.ch {
		flex: 1;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		padding: 8px 0;
		font-size: 13px;
		font-weight: 800;
	}
	.ch.busy {
		background: var(--color-amber-soft);
	}
	.ch.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.ch5 {
		font-size: 10.5px;
		font-weight: 600;
		line-height: 1.3;
		color: var(--color-muted);
	}

	.readout {
		display: flex;
		align-items: flex-end;
		gap: 8px;
		color: var(--color-ink);
	}
	.readout b {
		font-size: 17px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.readout.none b,
	.readout.weak b {
		color: var(--color-danger);
	}
	.readout.good b {
		color: var(--color-grass);
	}
	.walls {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.bars {
		display: inline-flex;
		align-items: flex-end;
		gap: 2px;
	}
	.bars i {
		width: 4px;
		border-radius: 1px;
		background: var(--color-line);
	}
	.bars i.lit {
		background: var(--color-ink);
	}

	.plan {
		display: block;
		padding: 0;
		border: none;
		background: none;
		width: min(90vw, 330px);
		flex: none;
		touch-action: none;
		cursor: grab;
		border-radius: 14px;
		outline: none;
	}
	.plan:focus-visible {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 30%, transparent);
	}
	.plan svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.floor {
		fill: var(--color-card);
	}
	.garden {
		fill: var(--color-grass-soft);
	}
	.ring {
		fill: none;
		stroke-width: 1.2;
		transition: r 0.4s ease;
	}
	.ring.b24 {
		stroke: color-mix(in srgb, var(--color-amber) 45%, transparent);
	}
	.ring.b5 {
		stroke: color-mix(in srgb, var(--color-brand) 40%, transparent);
	}
	.wall {
		stroke: var(--color-ink);
		stroke-width: 4;
		stroke-linecap: round;
		opacity: 0.75;
	}
	.room {
		fill: var(--color-faint);
		font-size: 9.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.ray {
		stroke-width: 1.5;
		opacity: 0.8;
	}
	.ray.good {
		stroke: var(--color-grass);
	}
	.ray.ok {
		stroke: var(--color-amber);
	}
	.ray.weak,
	.ray.none {
		stroke: var(--color-danger);
		opacity: 0.45;
	}
	.tag {
		fill: var(--color-muted);
		font-size: 9px;
		font-weight: 700;
		text-anchor: middle;
	}
	.tag.strong {
		fill: var(--color-brand);
	}
	.rt,
	.ph {
		color: var(--color-ink);
	}
	.nb {
		color: var(--color-faint);
		transition: color 0.3s ease;
	}
	.nb.clash {
		color: var(--color-danger);
	}
	.nb.clash .tag {
		fill: var(--color-danger);
	}
	.halo {
		stroke-width: 2;
		fill: var(--color-card);
	}
	.halo.good {
		stroke: var(--color-grass);
	}
	.halo.ok {
		stroke: var(--color-amber);
	}
	.halo.weak,
	.halo.none {
		stroke: var(--color-danger);
	}

	.goals {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
		max-width: min(94vw, 360px);
	}
	.goal {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			background 0.25s ease,
			color 0.25s ease;
	}
	.goal.met {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	@media (prefers-reduced-motion: reduce) {
		.ring,
		.goal,
		.nb {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.controls,
		.goals {
			width: 440px;
			max-width: 440px;
		}
		.plan {
			width: 420px;
		}
		.opt b {
			font-size: 13px;
		}
		.opt span {
			font-size: 9.5px;
		}
		.readout b {
			font-size: 20px;
		}
		.goal {
			font-size: 11px;
		}
	}
</style>
