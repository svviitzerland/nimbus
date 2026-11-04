<script lang="ts">
	// Guided backup lesson. A database server in a Jakarta data center takes orders, its disk dies,
	// and a backup box restores it by itself. Then a timeline shows why the schedule matters, the
	// 3 2 1 rule fills in a third copy far away in Singapore, and a fire proves why. On the last
	// beat the learner may pick a schedule and replay one busy day.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BackupPlan, BackupText } from '$lib/chapters/devops/backup/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BackupText);

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

	// ---- what the picture shows ----
	type Spot = 'shop' | 'srv' | 'box' | 'cloud';
	const P: Record<Spot, [number, number]> = {
		shop: [82, 12],
		srv: [82, 96],
		box: [228, 168],
		cloud: [384, 106]
	};
	const PER_HOUR = 75;
	const CRASH = 16 + 40 / 60;
	const FULL = Math.round(CRASH * PER_HOUR);

	let orders = $state(FULL);
	let disk = $state<'ok' | 'dead' | 'fresh'>('ok');
	let box = $state<'off' | 'on' | 'dead'>('off');
	let cloud = $state(false);
	let fire = $state(false);
	let tag = $state<{ kind: 'lost' | 'back'; n: number } | null>(null);
	let pkt = $state<{ at: Spot; on: boolean; snap: boolean }>({ at: 'shop', on: false, snap: true });
	let ruleOn = $state(0); // how many parts of 3 2 1 are lit
	let now = $state(0); // the timeline cursor, in hours
	let rows = $state<BackupPlan[]>([]);

	function reset() {
		orders = FULL;
		disk = 'ok';
		box = 'off';
		cloud = false;
		fire = false;
		tag = null;
		pkt = { at: 'shop', on: false, snap: true };
		ruleOn = 0;
		now = 0;
		rows = [];
	}

	function fly(a: Spot, b: Spot, then?: () => void): SeqStep[] {
		return [
			[60, () => (pkt = { at: a, on: true, snap: true })],
			[1150, () => (pkt = { at: b, on: true, snap: false })],
			[
				250,
				() => {
					pkt = { ...pkt, on: false };
					then?.();
				}
			]
		];
	}
	const order = (): SeqStep[] => fly('shop', 'srv', () => (orders += 3));
	const wait = (ms: number, fn: () => void = () => {}): SeqStep => [ms, fn];

	/** The cursor sweeping one day, from midnight to the crash. */
	function sweep(fromZero: boolean): SeqStep[] {
		const out: SeqStep[] = [];
		for (let h = 0; h <= 17; h++) {
			const at = Math.min(h, CRASH);
			out.push([
				200,
				() => {
					now = at;
					if (fromZero) orders = Math.round(at * PER_HOUR);
				}
			]);
		}
		return out;
	}

	// ---- the optional replay ----
	let plan = $state<BackupPlan | null>(null);
	let runId = $state(0);
	const saved = (p: BackupPlan) => (p === 'daily' ? 0 : 16 * PER_HOUR);

	function play(s: number, p: BackupPlan | null, still: boolean): (() => void) | undefined {
		reset();
		if (s === 0) {
			if (still) return;
			orders = FULL - 30;
			return runSeq([...order(), wait(500)], true);
		}
		if (s === 1) {
			if (still) {
				disk = 'dead';
				return;
			}
			return runSeq(
				[
					wait(10, () => {
						disk = 'ok';
						orders = FULL - 6;
					}),
					...order(),
					...order(),
					wait(2800, () => (disk = 'dead')),
					wait(400)
				],
				true
			);
		}
		if (s === 2) {
			box = 'on';
			if (still) return;
			return runSeq([...order(), ...fly('srv', 'box'), wait(900)], true);
		}
		if (s === 3 || s === 5) {
			box = 'on';
			if (still) {
				disk = 'fresh';
				tag = { kind: 'back', n: FULL };
				return;
			}
			return runSeq(
				[
					wait(1300, () => {
						disk = 'ok';
						orders = FULL;
						tag = null;
					}),
					wait(1600, () => (disk = 'dead')),
					wait(1100, () => (disk = 'fresh')),
					...fly('box', 'srv', () => (tag = { kind: 'back', n: FULL })),
					wait(2600)
				],
				true
			);
		}
		if (s === 4) {
			box = 'on';
			rows = ['daily', 'hourly'];
			if (still) {
				now = CRASH;
				disk = 'dead';
				return;
			}
			return runSeq(
				[
					wait(600, () => {
						now = 0;
						disk = 'ok';
					}),
					...sweep(false),
					wait(3400, () => (disk = 'dead'))
				],
				true
			);
		}
		if (s === 6 || s === 7) {
			box = 'on';
			cloud = true;
			ruleOn = 3;
			if (still || s === 7) return;
			cloud = false;
			ruleOn = 0;
			return runSeq(
				[
					wait(900, () => {
						cloud = false;
						ruleOn = 0;
					}),
					wait(1000, () => (ruleOn = 1)),
					...fly('box', 'cloud', () => (cloud = true)),
					wait(1000, () => (ruleOn = 2)),
					wait(3200, () => (ruleOn = 3))
				],
				true
			);
		}
		if (s === 8) {
			box = 'on';
			cloud = true;
			if (still) {
				fire = true;
				disk = 'dead';
				box = 'dead';
				return;
			}
			return runSeq(
				[
					wait(1200, () => {
						fire = false;
						disk = 'ok';
						box = 'on';
						tag = null;
					}),
					wait(2200, () => {
						fire = true;
						disk = 'dead';
						box = 'dead';
					}),
					wait(900, () => {
						fire = false;
						disk = 'fresh';
						box = 'off';
					}),
					...fly('cloud', 'srv', () => (tag = { kind: 'back', n: FULL })),
					wait(2600)
				],
				true
			);
		}
		// the last beat, resting until a schedule is picked
		if (!p) return;
		box = 'on';
		rows = [p];
		const finish = () => {
			disk = 'fresh';
			orders = saved(p);
			tag = { kind: 'lost', n: FULL - saved(p) };
			onstate?.(p);
		};
		if (still) {
			now = CRASH;
			finish();
			return;
		}
		orders = 0;
		return runSeq([
			...sweep(true),
			wait(1100, () => (disk = 'dead')),
			wait(900, () => (disk = 'fresh')),
			...fly('box', 'srv', finish)
		]);
	}

	$effect(() => {
		const s = step;
		const p = s === last ? plan : null;
		const still = reduce;
		void runId;
		return untrack(() => play(s, p, still));
	});

	function choose(p: BackupPlan) {
		plan = p;
		peek = null;
		runId += 1;
	}

	// ---- timeline geometry ----
	const X0 = 40;
	const X1 = 412;
	const tx0 = (h: number) => X0 + (h / CRASH) * (X1 - X0);
	const ticks = (p: BackupPlan) => (p === 'daily' ? [0] : Array.from({ length: 17 }, (_, h) => h));
	const lastTick = (p: BackupPlan) => (p === 'daily' ? 0 : 16);
	const rowY = (k: number, n: number) => (n === 1 ? 236 : 222 + k * 30);
	const crashed = $derived(now >= CRASH - 0.001);
	const showRule = $derived(step === 6 || step === 7);
	const count = $derived(disk === 'dead' ? 0 : orders);
</script>

{#snippet visual(_: number)}
	<div class="vis">
		{#if step === last}
			<div class="pick">
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					{#each ['daily', 'hourly'] as const as k (k)}
						<button type="button" class="chip" class:on={plan === k} onclick={() => choose(k)}
							>{tx.plans[k]}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<svg
			viewBox="0 -14 460 292"
			class="scene"
			role="img"
			aria-label="{tx.dbLabel}, {tx.boxLabel}, {tx.offLabel}"
		>
			<!-- a little shopping cart, where orders come from -->
			<g class="cart" transform="translate(70 -8)">
				<path d="M0 2h4l3 11h12l3 -8H6" />
				<circle cx="9" cy="17" r="1.8" />
				<circle cx="18" cy="17" r="1.8" />
			</g>

			<!-- the Jakarta building -->
			<rect x="8" y="30" width="292" height="178" rx="12" class="bldg" class:burn={fire} />
			<text x="22" y="48" class="lbl">{tx.siteLabel}</text>
			{#if fire}
				<g class="flames">
					{#each [56, 150, 244] as fx, n (fx)}
						<path
							d="M{fx} 32 q-14 -14 -2 -30 q2 12 10 6 q-2 -10 6 -18 q10 22 0 42 z"
							class="flame"
							style="animation-delay:{n * 0.2}s"
						/>
					{/each}
				</g>
				<text x="270" y="48" text-anchor="end" class="firetag">{tx.fireTag}</text>
			{/if}

			<!-- database server rack -->
			<g class:sooty={fire}>
				<rect x="36" y="62" width="92" height="124" rx="8" class="shell" />
				{#each [72, 108, 144] as y (y)}
					<rect
						x="44"
						{y}
						width="76"
						height="30"
						rx="5"
						class="unit"
						class:disk={y === 108}
						class:dead={y === 108 && disk === 'dead'}
						class:fresh={y === 108 && disk === 'fresh'}
					/>
					{#if y === 108}
						<circle cx="62" cy="123" r="8" class="platter" class:dead={disk === 'dead'} />
						<circle cx="62" cy="123" r="2" class="hub" />
						{#if disk === 'dead'}
							<path d="M54 113l8 9l-4 4l9 10" class="crack" />
						{/if}
					{:else}
						<line x1="56" y1={y + 11} x2="96" y2={y + 11} class="vent" />
						<line x1="56" y1={y + 19} x2="88" y2={y + 19} class="vent" />
					{/if}
					<circle
						cx="110"
						cy={y + 15}
						r="3.4"
						class="led"
						class:off={y === 108 && disk === 'dead'}
					/>
				{/each}
				{#if showRule}
					<g class="badge" transform="translate(128 64)"
						><circle r="9" /><text y="3.6" text-anchor="middle">1</text></g
					>
				{/if}
			</g>
			<text x="82" y="200" text-anchor="middle" class="cap-svg">{tx.dbLabel}</text>

			<!-- the order counter -->
			<text x="142" y="88" class="count" class:gone={disk === 'dead'}>{count}</text>
			<text x="142" y="102" class="small">{tx.ordersLabel}</text>
			{#if disk === 'dead' || disk === 'fresh'}
				<text x="142" y="127" class="disktag" class:dead={disk === 'dead'}
					>{disk === 'dead' ? tx.deadTag : tx.newTag}</text
				>
			{/if}
			{#if tag}
				<text x="142" y="145" class="restag {tag.kind}"
					>{(tag.kind === 'lost' ? tx.lostTag : tx.backTag).replace('{n}', String(tag.n))}</text
				>
			{/if}

			<!-- the backup box in the same building -->
			<g class:sooty={fire}>
				<rect x="180" y="150" width="96" height="38" rx="7" class="bbox {box}" />
				<circle cx="198" cy="169" r="6" class="platter small" class:dead={box === 'dead'} />
				{#if box === 'on'}
					<g transform="translate(222 162)" class="doc">
						<rect width="14" height="16" rx="2" />
						<line x1="3" y1="5" x2="11" y2="5" />
						<line x1="3" y1="9" x2="11" y2="9" />
					</g>
				{/if}
				<circle cx="262" cy="169" r="3.2" class="led" class:off={box !== 'on'} />
				{#if showRule}
					<g class="badge" transform="translate(276 152)"
						><circle r="9" /><text y="3.6" text-anchor="middle">2</text></g
					>
				{/if}
			</g>
			<text x="228" y="200" text-anchor="middle" class="cap-svg">{tx.boxLabel}</text>

			<!-- the far away region -->
			<path
				d="M334 132 a20 20 0 0 1 6 -38 a28 28 0 0 1 52 -12 a22 22 0 0 1 38 20 a17 17 0 0 1 -4 30 z"
				class="cloud"
				class:has={cloud}
			/>
			{#if cloud}
				<g transform="translate(376 98)" class="doc">
					<rect width="14" height="16" rx="2" />
					<line x1="3" y1="5" x2="11" y2="5" />
					<line x1="3" y1="9" x2="11" y2="9" />
				</g>
				{#if showRule}
					<g class="badge" transform="translate(428 90)"
						><circle r="9" /><text y="3.6" text-anchor="middle">3</text></g
					>
				{/if}
			{/if}
			<text x="382" y="152" text-anchor="middle" class="cap-svg">{tx.offLabel}</text>
			<text x="382" y="166" text-anchor="middle" class="small">{tx.offSub}</text>

			<!-- the packet of data that moves around -->
			<g
				class="pkt"
				class:snap={pkt.snap}
				class:off={!pkt.on}
				style="transform: translate({P[pkt.at][0]}px, {P[pkt.at][1]}px)"
			>
				<rect x="-9" y="-7" width="18" height="14" rx="3" />
				<line x1="-5" y1="-2" x2="5" y2="-2" />
				<line x1="-5" y1="2" x2="3" y2="2" />
			</g>

			<!-- the timeline of one busy day -->
			{#each rows as r, k (r)}
				{@const y = rowY(k, rows.length)}
				<text x={X0} y={y - 8} class="small">{r === 'daily' ? tx.dailyLabel : tx.hourlyLabel}</text>
				<line x1={X0} y1={y} x2={X1} y2={y} class="day" />
				<line x1={X0} y1={y} x2={tx0(now)} y2={y} class="day done" />
				{#each ticks(r).filter((h) => h <= now) as h (h)}
					<line x1={tx0(h)} y1={y - 5} x2={tx0(h)} y2={y + 5} class="tick" />
				{/each}
				{#if crashed}
					<rect
						x={tx0(lastTick(r))}
						y={y - 4}
						width={Math.max(3, X1 - tx0(lastTick(r)))}
						height="8"
						rx="4"
						class="gap"
					/>
					{#if k === 0}
						<text x={X1} y={y - 8} text-anchor="end" class="gaplbl">{tx.gapLabel}</text>
					{/if}
				{/if}
				{#if k === rows.length - 1}
					<text x={X0} y={y + 18} text-anchor="middle" class="small">{tx.startTime}</text>
					<text x={X1} y={y + 18} text-anchor="middle" class="small">{tx.crashTime}</text>
				{/if}
			{/each}

			{#if showRule}
				{#each tx.rule as r, k (k)}
					<g transform="translate({118 + k * 112} 238)" class="rule" class:on={ruleOn > k}>
						<rect x="-48" y="-14" width="96" height="28" rx="14" />
						<text y="4.5" text-anchor="middle">{r}</text>
					</g>
				{/each}
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
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-brand);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover,
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	/* ---- svg parts ---- */
	.cart path {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.cart circle {
		fill: var(--color-muted);
	}
	.bldg {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.bldg.burn {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.lbl {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.flame {
		fill: var(--color-amber);
		stroke: var(--color-danger);
		stroke-width: 1.2;
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: flicker 0.6s ease-in-out infinite alternate;
	}
	@keyframes flicker {
		to {
			transform: scaleY(1.15) scaleX(0.92);
		}
	}
	.firetag {
		font-size: 11px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		fill: var(--color-danger);
	}
	.sooty {
		opacity: 0.55;
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.unit.dead {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.unit.fresh {
		stroke: var(--color-grass);
		stroke-width: 1.6;
	}
	.platter {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.4;
	}
	.platter.dead {
		stroke: var(--color-danger);
	}
	.hub {
		fill: var(--color-muted);
	}
	.crack {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-grass);
		transition: fill 0.3s;
	}
	.led.off {
		fill: var(--color-line);
	}
	.cap-svg {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.small {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.count {
		font-size: 20px;
		font-weight: 800;
		fill: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.count.gone {
		fill: var(--color-danger);
	}
	.disktag {
		font-size: 10.5px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.disktag.dead {
		fill: var(--color-danger);
	}
	.restag {
		font-size: 11px;
		font-weight: 800;
	}
	.restag.back {
		fill: var(--color-grass);
	}
	.restag.lost {
		fill: var(--color-danger);
	}
	.bbox {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.3s,
			fill 0.3s;
	}
	.bbox.on {
		stroke: var(--color-brand);
	}
	.bbox.dead {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.doc rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.2;
	}
	.doc line {
		stroke: var(--color-brand);
		stroke-width: 1.2;
	}
	.cloud {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.cloud.has {
		stroke: var(--color-brand);
	}
	.badge circle {
		fill: var(--color-grass);
	}
	.badge text {
		font-size: 11px;
		font-weight: 800;
		fill: #fff;
	}

	.pkt {
		transition:
			transform 1.1s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.25s ease;
	}
	.pkt.snap {
		transition: none;
	}
	.pkt.off {
		opacity: 0;
	}
	.pkt rect {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.pkt line {
		stroke: var(--color-brand);
		stroke-width: 1.2;
	}

	.day {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.day.done {
		stroke: var(--color-brand);
		opacity: 0.35;
	}
	.tick {
		stroke: var(--color-grass);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.gap {
		fill: var(--color-danger);
		opacity: 0.75;
	}
	.gaplbl {
		font-size: 9.5px;
		font-weight: 800;
		fill: var(--color-danger);
	}
	.rule rect {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.3;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.rule text {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-faint);
		transition: fill 0.3s;
	}
	.rule.on rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.rule.on text {
		fill: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt,
		.bldg,
		.unit,
		.led,
		.bbox,
		.cloud,
		.rule rect,
		.rule text,
		.chip {
			transition: none;
		}
		.flame {
			animation: none;
		}
	}
</style>
