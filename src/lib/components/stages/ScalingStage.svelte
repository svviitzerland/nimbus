<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { ScalingText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ScalingText);

	// One shared crowd feeds both columns, so the two strategies face the same traffic.
	const LEVELS = [150, 450, 800];
	const LCOLOR = ['#8a949d', '#dd9e36', '#c2491f'];
	const LHEADS = [1, 4, 8];
	let level = $state(0);
	let surgeSeen = $state(false);

	// vertical: ONE machine, its specs grown tier by tier, capacity rising with it
	const TIERS = [
		{ cpu: 2, ram: 4, disk: 40, cap: 250 },
		{ cpu: 4, ram: 8, disk: 80, cap: 600 },
		{ cpu: 8, ram: 16, disk: 160, cap: 1300 },
		{ cpu: 16, ram: 32, disk: 320, cap: 2600 }
	];
	let tier = $state(0);
	let downtime = $state(false);
	const spec = $derived(TIERS[tier]);
	const atCeiling = $derived(tier >= TIERS.length - 1);

	// horizontal: MANY identical small machines, each the base tier, capacity adds up
	const BASE = TIERS[0];
	let machines = $state(1);
	const hCap = $derived(machines * BASE.cap);

	const visitors = $derived(LEVELS[level]);
	const vOver = $derived(visitors > spec.cap || downtime);
	const hOver = $derived(visitors > hCap);
	const prompt = $derived(
		level === 0 ? tx.promptRaise : vOver || hOver ? tx.promptRescue : tx.promptDone
	);

	function shade(load: number, cap: number) {
		const u = load / cap;
		return u > 1 ? '#d3584a' : u > 0.85 ? '#dd9e36' : '#3a9c64';
	}
	const vColor = $derived(downtime ? '#cfd6dd' : shade(visitors, spec.cap));
	const hColor = $derived(shade(visitors, hCap));

	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function register(m: string) {
		tried.add(m);
		if (tried.has('vertical') && tried.has('horizontal') && !done) {
			done = true;
			oncomplete?.();
		}
	}
	function setLevel(i: number) {
		level = i;
		if (!surgeSeen && (LEVELS[i] > spec.cap || LEVELS[i] > hCap)) {
			surgeSeen = true;
			onstate?.('surge');
		}
	}
	function upgrade() {
		if (atCeiling) return;
		tier += 1;
		onstate?.(tier >= TIERS.length - 1 ? 'ceiling' : 'vertical');
		register('vertical');
	}
	function downgrade() {
		if (tier === 0 || downtime) return;
		downtime = true;
		onstate?.('downgrade');
		timers.push(
			setTimeout(() => {
				tier -= 1;
				downtime = false;
			}, 1500)
		);
	}
	function addMachine() {
		if (machines < 4) machines += 1;
		onstate?.('horizontal');
		register('horizontal');
	}
	function removeMachine() {
		if (machines > 1) machines -= 1;
	}

	// Live visitors raining onto each column, faster when the crowd grows.
	type Drop = { id: number; lane: number; routed: boolean };
	let vDrops = $state<Drop[]>([]);
	let hDrops = $state<Drop[]>([]);
	let did = 0;

	$effect(() => {
		const gap = [1000, 360, 170][level];
		const iv = setInterval(() => {
			const v: Drop = { id: ++did, lane: 50, routed: false };
			vDrops = [...vDrops.slice(-12), v];
			timers.push(setTimeout(() => (vDrops = vDrops.filter((d) => d.id !== v.id)), 700));

			const n = machines;
			const lane = n > 1 ? ((Math.floor(Math.random() * n) + 0.5) / n) * 100 : 50;
			const h: Drop = { id: ++did, lane, routed: false };
			hDrops = [...hDrops.slice(-12), h];
			if (n > 1)
				timers.push(
					setTimeout(
						() => (hDrops = hDrops.map((d) => (d.id === h.id ? { ...d, routed: true } : d))),
						220
					)
				);
			timers.push(setTimeout(() => (hDrops = hDrops.filter((d) => d.id !== h.id)), 760));
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

{#snippet rackIcon(size: number)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="3" y="4" width="18" height="7" rx="2" stroke="currentColor" stroke-width="1.7" />
		<rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" stroke-width="1.7" />
		<circle cx="7" cy="7.5" r="1" fill="currentColor" />
		<circle cx="7" cy="16.5" r="1" fill="currentColor" />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3 md:gap-4">
	<!-- guidance + the shared crowd both columns must survive -->
	<p class="prompt">{prompt}</p>
	<div class="traffic">
		<span class="tlabel">{tx.trafficLabel}</span>
		<div class="seg">
			{#each LEVELS as n, i (i)}
				<button
					type="button"
					class="tbtn"
					class:on={level === i}
					class:invite={level === 0 && i === 2}
					onclick={() => setLevel(i)}
				>
					<b>{n}</b>
					<span>{[tx.levelCalm, tx.levelBusy, tx.levelFlood][i]}</span>
				</button>
			{/each}
		</div>
	</div>

	<div class="grid w-full max-w-[680px] grid-cols-2 gap-3 md:gap-5">
		<!-- VERTICAL: one machine made bigger -->
		<section class="card">
			<header>
				<span class="ic" style="--a:#2e6fe0">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M12 20V4m0 0l-6 6m6-6 6 6"
							stroke="#2e6fe0"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<div>
					<h3>{tx.tabVertical}</h3>
					<p>{tx.hintVertical}</p>
				</div>
			</header>

			<div class="scene">
				<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
					<line class="rail" x1="50" y1="16" x2="50" y2="62" />
				</svg>
				<div class="crowd">
					{#each Array(LHEADS[level]) as _, k (k)}
						<span class="hd">{@render person(11, LCOLOR[level])}</span>
					{/each}
				</div>
				{#each vDrops as d (d.id)}
					<span class="dropper" style="--lx:{d.lane}%">{@render person(11, LCOLOR[level])}</span>
				{/each}
				<div class="stack">
					{#if vOver && !downtime}
						<div class="queue">
							{#each Array(3) as _, k (k)}<span class="hd">{@render person(9, '#d3584a')}</span
								>{/each}
						</div>
					{/if}
					<div
						class="machine"
						class:down={downtime}
						class:over={vOver && !downtime}
						style="--t:{tier}; --c:{vColor}"
					>
						{@render rackIcon(20)}
						{#if downtime}<span class="downmask">{tx.siteDown}</span>{/if}
						{#if atCeiling && !downtime}<span class="maxbadge">{tx.maxedOut}</span>{/if}
					</div>
				</div>
			</div>

			<div class="chips">
				{#key spec.cpu}<span>{spec.cpu} vCPU</span>{/key}
				{#key spec.ram}<span>{spec.ram} GB</span>{/key}
				{#key spec.disk}<span>{spec.disk} GB</span>{/key}
			</div>
			<div class="meta">
				<span class="cap">{tx.capacity.replace('{n}', String(spec.cap))}</span>
				<span class="status" class:bad={vOver}><i></i>{vOver ? tx.statusOver : tx.statusOk}</span>
			</div>

			<div class="ctrls">
				<button
					class="act act-brand"
					class:pulse={vOver && !atCeiling}
					onclick={upgrade}
					disabled={atCeiling}>{tx.upgrade}</button
				>
				<button class="act act-line" onclick={downgrade} disabled={tier === 0 || downtime}
					>{tx.downgrade}</button
				>
			</div>
		</section>

		<!-- HORIZONTAL: more identical small machines -->
		<section class="card">
			<header>
				<span class="ic" style="--a:#3a9c64">
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M4 12h16m0 0l-6-6m6 6-6 6"
							stroke="#3a9c64"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<div>
					<h3>{tx.tabHorizontal}</h3>
					<p>{tx.hintHorizontal}</p>
				</div>
			</header>

			<div class="scene">
				<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
					{#if machines > 1}
						<line class="rail" x1="50" y1="16" x2="50" y2="36" />
						{#each Array(machines) as _, i (i)}
							<line class="rail" x1="50" y1="42" x2={((i + 0.5) / machines) * 100} y2="68" />
						{/each}
					{:else}
						<line class="rail" x1="50" y1="16" x2="50" y2="68" />
					{/if}
				</svg>
				<div class="crowd">
					{#each Array(LHEADS[level]) as _, k (k)}
						<span class="hd">{@render person(11, LCOLOR[level])}</span>
					{/each}
				</div>
				{#if machines > 1}
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
				{/if}
				{#each hDrops as d (d.id)}
					<span
						class="dropper"
						class:two={machines > 1}
						class:routed={d.routed}
						style="--lx:{d.lane}%"
					>
						{@render person(11, LCOLOR[level])}
					</span>
				{/each}
				<div class="hrow">
					{#each Array(machines) as _, i (i)}
						<div class="hcol">
							{#if hOver}
								<div class="queue">
									{#each Array(2) as _, k (k)}<span class="hd">{@render person(8, '#d3584a')}</span
										>{/each}
								</div>
							{/if}
							<div class="hmachine" class:over={hOver} style="--c:{hColor}">
								{@render rackIcon(14)}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="chips"><span>{tx.perMachineSpec}</span></div>
			<div class="meta">
				<span class="cap">{tx.capacity.replace('{n}', String(hCap))}</span>
				<span class="status" class:bad={hOver}><i></i>{hOver ? tx.statusOver : tx.statusOk}</span>
			</div>

			<div class="ctrls">
				<button
					class="act act-grass"
					class:pulse={hOver}
					onclick={addMachine}
					disabled={machines >= 4}>{tx.addMachine}</button
				>
				<button class="act act-line" onclick={removeMachine} disabled={machines <= 1}
					>{tx.removeMachine}</button
				>
			</div>
		</section>
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

	/* the shared crowd control */
	.traffic {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.tlabel {
		font-size: 11px;
		font-weight: 700;
		color: #5e6b76;
	}
	.seg {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 3px;
	}
	.tbtn {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 9px;
		padding: 4px 12px;
		line-height: 1.15;
		transition: background 0.2s ease;
	}
	.tbtn b {
		font-size: 12px;
		font-weight: 800;
		color: #16212b;
		font-variant-numeric: tabular-nums;
	}
	.tbtn span {
		font-size: 8.5px;
		font-weight: 600;
		color: #8a949d;
	}
	.tbtn.on {
		background: #16212b;
	}
	.tbtn.on b,
	.tbtn.on span {
		color: #fff;
	}
	.tbtn.invite {
		animation: pulse 1.8s ease-in-out infinite;
	}

	.card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 12px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.05);
	}
	header {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.ic {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: color-mix(in srgb, var(--a) 12%, #fff);
	}
	header h3 {
		font-size: 13px;
		font-weight: 800;
		color: #16212b;
		line-height: 1.1;
	}
	header p {
		font-size: 10px;
		color: #8a949d;
		line-height: 1.2;
	}

	/* the live scene, crowd up top raining onto the machines */
	.scene {
		position: relative;
		height: 138px;
		border-radius: 12px;
		background: #f7f6f2;
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
		top: 7px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1px;
		max-width: 80px;
		line-height: 0;
		z-index: 3;
	}
	.hd {
		line-height: 0;
	}
	.balmini {
		position: absolute;
		top: 34%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: 3px;
		border-radius: 8px;
		border: 1px solid #cdddf6;
		background: #eaf1fc;
		padding: 2px 7px;
		font-size: 8px;
		font-weight: 700;
		color: #2e6fe0;
		white-space: nowrap;
		z-index: 3;
		animation: pop 0.3s ease;
	}

	/* visitors raining down */
	.dropper {
		position: absolute;
		top: 14%;
		left: 50%;
		transform: translateX(-50%);
		line-height: 0;
		z-index: 1;
		animation: dfall 0.6s linear forwards;
	}
	.dropper.two {
		animation: ddrop 0.22s ease-in forwards;
	}
	.dropper.two.routed {
		animation: droute 0.45s ease-out forwards;
	}
	@keyframes dfall {
		from {
			top: 14%;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		to {
			top: 58%;
			opacity: 1;
		}
	}
	@keyframes ddrop {
		from {
			top: 14%;
			left: 50%;
			opacity: 0;
		}
		to {
			top: 34%;
			left: 50%;
			opacity: 1;
		}
	}
	@keyframes droute {
		from {
			top: 34%;
			left: 50%;
			opacity: 1;
		}
		to {
			top: 60%;
			left: var(--lx);
			opacity: 1;
		}
	}

	/* vertical machine, bottom anchored so it grows upward */
	.stack {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		z-index: 2;
	}
	.queue {
		display: flex;
		gap: 1px;
		line-height: 0;
		animation: pop 0.3s ease;
	}
	.machine {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(40px + var(--t) * 12px);
		height: calc(40px + var(--t) * 12px);
		border-radius: 12px;
		border: 2px solid var(--c);
		background: color-mix(in srgb, var(--c) 10%, #fff);
		color: var(--c);
		box-shadow: 0 8px 18px color-mix(in srgb, var(--c) 22%, transparent);
		transition:
			width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			height 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
			border-color 0.3s ease,
			background 0.3s ease,
			color 0.3s ease;
	}
	.machine.over {
		animation: shake 0.4s ease-in-out infinite;
	}
	.downmask {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3px;
		text-align: center;
		border-radius: 10px;
		background: rgba(238, 240, 242, 0.92);
		color: #b8392c;
		font-size: 8px;
		font-weight: 700;
		line-height: 1.15;
	}
	.maxbadge {
		position: absolute;
		top: -8px;
		right: -6px;
		border-radius: 999px;
		background: #dd9e36;
		color: #fff;
		font-size: 8.5px;
		font-weight: 700;
		padding: 2px 7px;
		white-space: nowrap;
	}

	/* horizontal machines, identical small boxes */
	.hrow {
		position: absolute;
		bottom: 8px;
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
		gap: 2px;
	}
	.hmachine {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
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
	.hmachine.over {
		animation: shake 0.4s ease-in-out infinite;
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

	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3px;
	}
	.chips span {
		border-radius: 999px;
		background: #fff;
		border: 1px solid #e8e2d8;
		padding: 1px 7px;
		font-size: 9.5px;
		font-weight: 700;
		color: #5e6b76;
		font-variant-numeric: tabular-nums;
		animation: bump 0.4s ease;
	}
	@keyframes bump {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(1.12);
			border-color: #2e6fe0;
			color: #2e6fe0;
		}
		100% {
			transform: scale(1);
		}
	}
	.meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 700;
		color: #2f7d54;
		text-align: center;
	}
	.status {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 9.5px;
		font-weight: 700;
		color: #2f7d54;
	}
	.status i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #3a9c64;
	}
	.status.bad {
		color: #b8392c;
	}
	.status.bad i {
		background: #d3584a;
		animation: blink 0.8s ease-in-out infinite;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.ctrls {
		display: flex;
		justify-content: center;
		gap: 6px;
	}
	.act {
		border-radius: 999px;
		padding: 6px 14px;
		font-size: 12px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			transform 0.15s ease;
	}
	.act:active {
		transform: translateY(1px);
	}
	.act-brand {
		background: #2e6fe0;
		color: #fff;
	}
	.act-grass {
		background: #3a9c64;
		color: #fff;
	}
	.act-line {
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
	}
	.act:disabled {
		opacity: 0.4;
	}
	.act:enabled:hover {
		filter: brightness(1.08);
	}
	.pulse {
		animation: pulse 1.8s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.16);
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .prompt {
		color: var(--color-muted);
	}
	:global(.dark) .tlabel {
		color: var(--color-muted);
	}
	:global(.dark) .seg {
		background: var(--color-card);
		border-color: var(--color-line);
	}
	:global(.dark) .tbtn b {
		color: var(--color-ink);
	}
	:global(.dark) .tbtn span {
		color: var(--color-faint);
	}
	:global(.dark) .tbtn.on {
		background: var(--btn-primary);
	}
	:global(.dark) .card {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) header h3 {
		color: var(--color-ink);
	}
	:global(.dark) header p {
		color: var(--color-faint);
	}
	:global(.dark) .ic {
		background: color-mix(in srgb, var(--a) 20%, var(--color-card));
	}
	:global(.dark) .scene {
		background: #1e2835;
	}
	:global(.dark) .rail {
		stroke: var(--color-line);
	}
	:global(.dark) .balmini {
		background: var(--color-card);
		border-color: #3a5a80;
		color: var(--color-brand);
	}
	:global(.dark) .machine {
		background: color-mix(in srgb, var(--c) 20%, var(--color-card));
	}
	:global(.dark) .downmask {
		background: rgba(27, 37, 51, 0.92);
		color: var(--color-danger);
	}
	:global(.dark) .hmachine {
		background: color-mix(in srgb, var(--c) 20%, var(--color-card));
	}
	:global(.dark) .chips span {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-muted);
	}
	:global(.dark) .cap {
		color: var(--color-grass);
	}
	:global(.dark) .status {
		color: var(--color-grass);
	}
	:global(.dark) .status.bad {
		color: var(--color-danger);
	}
	:global(.dark) .act-line {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse,
		.tbtn.invite,
		.dropper,
		.machine.over,
		.hmachine.over,
		.rail,
		.status.bad i {
			animation-duration: 0.01s;
		}
	}

	@media (min-width: 768px) {
		.prompt {
			max-width: 480px;
			font-size: 14px;
		}
		.tlabel {
			font-size: 13px;
		}
		.tbtn {
			padding: 5px 16px;
		}
		.tbtn b {
			font-size: 14px;
		}
		.tbtn span {
			font-size: 10px;
		}
		.card {
			gap: 12px;
			padding: 18px;
		}
		header h3 {
			font-size: 16px;
		}
		header p {
			font-size: 12px;
		}
		.ic {
			width: 32px;
			height: 32px;
		}
		.scene {
			height: 186px;
		}
		.crowd {
			max-width: 110px;
		}
		.machine {
			width: calc(56px + var(--t) * 17px);
			height: calc(56px + var(--t) * 17px);
		}
		.hmachine {
			width: 46px;
			height: 46px;
		}
		.balmini {
			font-size: 10px;
			padding: 3px 10px;
		}
		.chips span {
			font-size: 11.5px;
			padding: 2px 10px;
		}
		.cap {
			font-size: 13px;
		}
		.status {
			font-size: 11.5px;
		}
		.act {
			font-size: 13.5px;
			padding: 8px 18px;
		}
		.maxbadge,
		.downmask {
			font-size: 10px;
		}
	}
</style>
