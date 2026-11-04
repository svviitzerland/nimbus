<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AutoScalingText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as AutoScalingText);

	// The crowd drifts on its own like real traffic; the learner can still nudge it.
	const STEP = 150;
	const V_MIN = 150;
	const V_MAX = 1050;
	let visitors = $state(150);
	let trend = $state(1);
	let lastNudge = 0;

	function nudge(dir: number) {
		visitors = Math.min(V_MAX, Math.max(V_MIN, visitors + dir * STEP));
		trend = dir;
		lastNudge = Date.now();
	}

	const MIN = 1;
	const MAX = 6;
	const PER = 250; // visitors one machine can serve at full tilt
	let machines = $state(1);

	// average CPU follows visitors per machine; the rule watches this number
	const cpu = $derived(Math.min(99, Math.round((visitors / (machines * PER)) * 95)));
	const firingUp = $derived(cpu > 70 && machines < MAX);
	const firingDown = $derived(cpu < 30 && machines > MIN);
	const cpuColor = $derived(cpu > 70 ? '#d3584a' : cpu > 50 ? '#dd9e36' : '#3a9c64');

	const heads = $derived(Math.min(7, Math.ceil(visitors / STEP)));
	const crowdColor = $derived(
		visitors >= 750 ? '#c2491f' : visitors >= 450 ? '#dd9e36' : '#8a949d'
	);

	let upSeen = $state(false);
	let downSeen = $state(false);
	let done = false;
	const prompt = $derived(
		cpu > 70
			? tx.promptWatch
			: upSeen && downSeen
				? tx.promptDone
				: upSeen
					? tx.promptDrop
					: tx.promptRaise
	);

	// a short lived toast each time the robot acts
	let evt = $state<{ id: number; txt: string } | null>(null);
	let eid = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function robotActs(txt: string) {
		const id = ++eid;
		evt = { id, txt };
		timers.push(setTimeout(() => evt?.id === id && (evt = null), 1400));
	}

	// the traffic wanders by itself, climbing and dipping like a real day. A manual
	// nudge pauses the drift for a moment so it never fights the learner.
	$effect(() => {
		const iv = setInterval(() => {
			if (Date.now() - lastNudge < 6000) return;
			if (visitors >= V_MAX) trend = -1;
			else if (visitors <= V_MIN) trend = 1;
			else if (Math.random() < 0.22) trend = -trend;
			visitors = Math.min(V_MAX, Math.max(V_MIN, visitors + trend * STEP));
		}, 5200);
		return () => clearInterval(iv);
	});

	// the autoscaler wakes up on a fixed beat, checks the rule, moves one machine at a time
	$effect(() => {
		const iv = setInterval(() => {
			if (cpu > 70 && machines < MAX) {
				machines += 1;
				robotActs(tx.addEvent);
				if (!upSeen) {
					upSeen = true;
					onstate?.('scaled-up');
				}
			} else if (cpu < 30 && machines > MIN) {
				machines -= 1;
				robotActs(tx.removeEvent);
				if (upSeen && !downSeen) {
					downSeen = true;
					onstate?.('scaled-down');
					if (!done) {
						done = true;
						oncomplete?.();
					}
				}
			}
		}, 1100);
		return () => clearInterval(iv);
	});

	// visitors raining through the balancer onto the machines, like the lessons before
	type Drop = { id: number; lane: number; routed: boolean };
	let drops = $state<Drop[]>([]);
	let did = 0;

	$effect(() => {
		const gap = Math.max(140, Math.min(1100, Math.round(160000 / visitors)));
		const iv = setInterval(() => {
			const n = machines;
			const lane = ((Math.floor(Math.random() * n) + 0.5) / n) * 100;
			const d: Drop = { id: ++did, lane, routed: false };
			drops = [...drops.slice(-12), d];
			timers.push(
				setTimeout(
					() => (drops = drops.map((x) => (x.id === d.id ? { ...x, routed: true } : x))),
					220
				)
			);
			timers.push(setTimeout(() => (drops = drops.filter((x) => x.id !== d.id)), 760));
		}, gap);
		return () => clearInterval(iv);
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet person(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="8" r="4" fill={color} />
		<path d="M4 21a8 8 0 0 1 16 0Z" fill={color} />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3 md:gap-4">
	<p class="prompt">{prompt}</p>

	<!-- the only control the learner gets, a visitor counter -->
	<div class="counter">
		<button
			type="button"
			class="cbtn"
			aria-label={tx.minusLabel}
			onclick={() => nudge(-1)}
			disabled={visitors <= V_MIN}>−</button
		>
		<div class="cnum">
			<span class="numrow">
				{#key visitors}<b>{visitors}</b>{/key}
				<svg
					class="tarrow"
					class:fall={trend < 0}
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M12 20V4m0 0l-6 6m6-6 6 6"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			<span>{tx.trafficLabel}</span>
		</div>
		<button
			type="button"
			class="cbtn"
			aria-label={tx.plusLabel}
			onclick={() => nudge(1)}
			disabled={visitors >= V_MAX}>+</button
		>
	</div>

	<div class="board">
		<!-- the familiar scene, crowd through the balancer onto identical machines -->
		<div class="scene">
			<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				<line class="rail" x1="50" y1="16" x2="50" y2="34" />
				{#each Array(machines) as _, i (i)}
					<line class="rail" x1="50" y1="40" x2={((i + 0.5) / machines) * 100} y2="66" />
				{/each}
			</svg>
			<div class="crowd">
				{#each Array(heads) as _, k (k)}
					<span class="hd">{@render person(11, crowdColor)}</span>
				{/each}
			</div>
			<div class="balmini">
				<svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M12 4v6m0 0L6 18m6-8 6 8"
						stroke="#2e6fe0"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				{tx.balancerLabel}
			</div>
			{#each drops as d (d.id)}
				<span class="dropper" class:routed={d.routed} style="--lx:{d.lane}%">
					{@render person(11, crowdColor)}
				</span>
			{/each}
			<div class="hrow">
				{#each Array(machines) as _, i (i)}
					<div class="hcol">
						<div class="hmachine" class:hot={cpu > 90} style="--c:{cpuColor}">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect
									x="3"
									y="4"
									width="18"
									height="7"
									rx="2"
									stroke="currentColor"
									stroke-width="1.7"
								/>
								<rect
									x="3"
									y="13"
									width="18"
									height="7"
									rx="2"
									stroke="currentColor"
									stroke-width="1.7"
								/>
								<circle cx="7" cy="7.5" r="1" fill="currentColor" />
								<circle cx="7" cy="16.5" r="1" fill="currentColor" />
							</svg>
						</div>
						<span class="cputrack"><i style="width:{cpu}%; background:{cpuColor}"></i></span>
					</div>
				{/each}
			</div>
		</div>

		<!-- the robot's rule, kept as plain as a sticky note -->
		<div class="rules">
			<span class="rtitle">{tx.ruleTitle}</span>

			<div class="gauge">
				<span class="glabel">{tx.cpuLabel}</span>
				<span class="gtrack">
					<i class="gfill" style="width:{cpu}%; background:{cpuColor}"></i>
					<i class="tick" style="left:30%"></i>
					<i class="tick" style="left:70%"></i>
				</span>
				<span class="gnum" style="color:{cpuColor}">{cpu}%</span>
			</div>

			<div class="rrow" class:hot={firingUp}>
				<span class="cond">{tx.condUp}</span>
				<span class="ract up">{tx.actUp}</span>
			</div>
			<div class="rrow" class:hotdown={firingDown}>
				<span class="cond">{tx.condDown}</span>
				<span class="ract down">{tx.actDown}</span>
			</div>

			<div class="rfoot">
				{#key machines}<span class="chip cost">{tx.costLabel.replace('{n}', String(machines))}</span
					>{/key}
				{#if evt}
					{#key evt.id}<span class="evt">{evt.txt}</span>{/key}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.prompt {
		max-width: 320px;
		text-align: center;
		font-size: 12px;
		line-height: 1.4;
		color: #6a7681;
	}

	/* visitor counter, minus and plus around a big number */
	.counter {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 5px 6px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.06);
	}
	.cbtn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #16212b;
		color: #fff;
		font-size: 17px;
		font-weight: 700;
		line-height: 1;
		transition:
			filter 0.2s ease,
			transform 0.15s ease;
	}
	.cbtn:enabled:hover {
		filter: brightness(1.2);
	}
	.cbtn:active {
		transform: translateY(1px);
	}
	.cbtn:disabled {
		opacity: 0.3;
	}
	.numrow {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.tarrow {
		color: #8a949d;
		transition: transform 0.3s ease;
	}
	.tarrow.fall {
		transform: rotate(180deg);
	}
	.cnum {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 92px;
		line-height: 1.05;
	}
	.cnum b {
		font-size: 16px;
		font-weight: 800;
		color: #16212b;
		font-variant-numeric: tabular-nums;
		animation: bump 0.3s ease;
	}
	.cnum span {
		font-size: 9px;
		font-weight: 600;
		color: #8a949d;
	}

	.board {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		gap: 10px;
	}

	/* the live scene */
	.scene {
		position: relative;
		height: 148px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.05);
		overflow: hidden;
	}
	.rails {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.rail {
		stroke: #dcd6cb;
		stroke-width: 2;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -8;
		}
	}
	.crowd {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1px;
		max-width: 90px;
		line-height: 0;
		z-index: 3;
	}
	.hd {
		line-height: 0;
	}
	.balmini {
		position: absolute;
		top: 36%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 3px;
		border-radius: 8px;
		border: 1px solid #cdddf6;
		background: #eaf1fc;
		padding: 2px 8px;
		font-size: 8px;
		font-weight: 700;
		color: #2e6fe0;
		white-space: nowrap;
		z-index: 3;
	}
	.dropper {
		position: absolute;
		top: 14%;
		left: 50%;
		transform: translateX(-50%);
		line-height: 0;
		z-index: 1;
		animation: ddrop 0.22s ease-in forwards;
	}
	.dropper.routed {
		animation: droute 0.45s ease-out forwards;
	}
	@keyframes ddrop {
		from {
			top: 14%;
			left: 50%;
			opacity: 0;
		}
		to {
			top: 36%;
			left: 50%;
			opacity: 1;
		}
	}
	@keyframes droute {
		from {
			top: 36%;
			left: 50%;
			opacity: 1;
		}
		to {
			top: 60%;
			left: var(--lx);
			opacity: 1;
		}
	}
	.hrow {
		position: absolute;
		bottom: 10px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		z-index: 2;
	}
	.hcol {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.hmachine {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		border: 2px solid var(--c);
		background: color-mix(in srgb, var(--c) 10%, #fff);
		color: var(--c);
		box-shadow: 0 5px 12px color-mix(in srgb, var(--c) 20%, transparent);
		animation: pop 0.3s ease;
		transition:
			border-color 0.3s ease,
			background 0.3s ease,
			color 0.3s ease;
	}
	.hmachine.hot {
		animation: shake 0.4s ease-in-out infinite;
	}
	.cputrack {
		display: block;
		width: 26px;
		height: 3px;
		border-radius: 2px;
		background: #ece6dc;
		overflow: hidden;
	}
	.cputrack i {
		display: block;
		height: 100%;
		border-radius: 2px;
		transition:
			width 0.5s ease,
			background 0.3s ease;
	}
	@keyframes pop {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-1.5px);
		}
		75% {
			transform: translateX(1.5px);
		}
	}

	/* the rule card, one glance and you get it */
	.rules {
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 12px 14px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.05);
	}
	.rtitle {
		font-size: 12px;
		font-weight: 800;
		color: #16212b;
	}
	.gauge {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.glabel {
		flex: none;
		font-size: 11px;
		font-weight: 800;
		color: #5e6b76;
	}
	.gtrack {
		position: relative;
		flex: 1;
		height: 10px;
		border-radius: 999px;
		background: #f1ede5;
		overflow: hidden;
	}
	.gfill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		transition:
			width 0.5s ease,
			background 0.3s ease;
	}
	.tick {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1.5px;
		background: rgba(22, 33, 43, 0.25);
	}
	.gnum {
		flex: none;
		width: 38px;
		text-align: right;
		font-size: 13px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}
	.rrow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		border-radius: 10px;
		border: 1px solid #f1ede5;
		background: #faf9f6;
		padding: 6px 10px;
		transition: all 0.25s ease;
	}
	.cond {
		font-size: 11px;
		font-weight: 700;
		color: #5e6b76;
	}
	.ract {
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 700;
		white-space: nowrap;
	}
	.ract.up {
		background: #ecf6f0;
		border: 1px solid #cde6d7;
		color: #2f7d54;
	}
	.ract.down {
		background: #eaf1fc;
		border: 1px solid #cdddf6;
		color: #2e6fe0;
	}
	.rrow.hot {
		border-color: #eecac4;
		background: #fbeae7;
	}
	.rrow.hot .cond {
		color: #b8392c;
	}
	.rrow.hot .ract.up {
		background: #3a9c64;
		border-color: #3a9c64;
		color: #fff;
	}
	.rrow.hotdown {
		border-color: #cdddf6;
		background: #eaf1fc;
	}
	.rrow.hotdown .cond {
		color: #2e6fe0;
	}
	.rrow.hotdown .ract.down {
		background: #2e6fe0;
		border-color: #2e6fe0;
		color: #fff;
	}
	.rfoot {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 20px;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 700;
		color: #5e6b76;
		font-variant-numeric: tabular-nums;
		animation: bump 0.4s ease;
	}
	.chip.cost {
		border-color: #cde6d7;
		background: #ecf6f0;
		color: #2f7d54;
	}
	.evt {
		margin-left: auto;
		border-radius: 999px;
		background: #16212b;
		color: #fff;
		padding: 2px 10px;
		font-size: 10px;
		font-weight: 700;
		animation: toast 1.4s ease forwards;
	}
	@keyframes toast {
		0% {
			transform: translateY(4px);
			opacity: 0;
		}
		15%,
		80% {
			transform: translateY(0);
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes bump {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .prompt {
		color: var(--color-muted);
	}
	:global(.dark) .counter {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .cbtn {
		background: var(--btn-primary);
	}
	:global(.dark) .tarrow {
		color: var(--color-faint);
	}
	:global(.dark) .cnum b {
		color: var(--color-ink);
	}
	:global(.dark) .cnum span {
		color: var(--color-faint);
	}
	:global(.dark) .scene {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .rail {
		stroke: var(--color-line);
	}
	:global(.dark) .balmini {
		background: var(--color-card);
		border-color: #3a5a80;
		color: var(--color-brand);
	}
	:global(.dark) .hmachine {
		background: color-mix(in srgb, var(--c) 20%, var(--color-card));
	}
	:global(.dark) .cputrack {
		background: var(--color-line);
	}
	:global(.dark) .rules {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .rtitle {
		color: var(--color-ink);
	}
	:global(.dark) .glabel {
		color: var(--color-muted);
	}
	:global(.dark) .gtrack {
		background: #222a36;
	}
	:global(.dark) .tick {
		background: rgba(255, 255, 255, 0.2);
	}
	:global(.dark) .rrow {
		background: var(--color-paper);
		border-color: var(--color-line);
	}
	:global(.dark) .cond {
		color: var(--color-muted);
	}
	:global(.dark) .ract.up {
		background: var(--color-grass-soft);
		border-color: #1f3d28;
		color: var(--color-grass);
	}
	:global(.dark) .ract.down {
		background: var(--color-brand-soft);
		border-color: #3a5a80;
		color: var(--color-brand);
	}
	:global(.dark) .rrow.hot {
		border-color: #4a2a2a;
		background: var(--color-danger-soft);
	}
	:global(.dark) .rrow.hot .cond {
		color: var(--color-danger);
	}
	:global(.dark) .rrow.hotdown {
		border-color: #3a5a80;
		background: var(--color-brand-soft);
	}
	:global(.dark) .rrow.hotdown .cond {
		color: var(--color-brand);
	}
	:global(.dark) .chip {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-muted);
	}
	:global(.dark) .chip.cost {
		background: var(--color-grass-soft);
		border-color: #1f3d28;
		color: var(--color-grass);
	}
	:global(.dark) .evt {
		background: var(--btn-primary);
	}

	@media (prefers-reduced-motion: reduce) {
		.dropper,
		.hmachine.hot,
		.rail,
		.evt {
			animation-duration: 0.01s;
		}
	}

	@media (min-width: 768px) {
		.prompt {
			max-width: 480px;
			font-size: 14px;
		}
		.cbtn {
			width: 38px;
			height: 38px;
			font-size: 20px;
		}
		.cnum {
			min-width: 110px;
		}
		.cnum b {
			font-size: 19px;
		}
		.cnum span {
			font-size: 10.5px;
		}
		.board {
			max-width: 760px;
			flex-direction: row;
			align-items: stretch;
		}
		.scene {
			flex: 1.25;
			height: auto;
			min-height: 212px;
		}
		.rules {
			flex: 1;
			gap: 11px;
			padding: 16px 18px;
		}
		.crowd {
			max-width: 120px;
		}
		.balmini {
			font-size: 10px;
			padding: 3px 10px;
		}
		.hmachine {
			width: 40px;
			height: 40px;
		}
		.hmachine svg {
			width: 17px;
			height: 17px;
		}
		.cputrack {
			width: 36px;
			height: 4px;
		}
		.rtitle {
			font-size: 14px;
		}
		.glabel {
			font-size: 13px;
		}
		.gnum {
			font-size: 15px;
			width: 44px;
		}
		.rrow {
			padding: 8px 12px;
		}
		.cond {
			font-size: 13px;
		}
		.ract {
			font-size: 11.5px;
			padding: 3px 12px;
		}
		.chip {
			font-size: 11.5px;
			padding: 3px 12px;
		}
		.evt {
			font-size: 11.5px;
			padding: 3px 12px;
		}
	}
</style>
