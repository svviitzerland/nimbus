<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	// Guided "watch" stage for replication and sharding. The nimbus.com app sits on top and sends
	// little dots down to the databases, blue for reads and amber for writes. One busy database
	// becomes a primary with two replicas (green dots copy every change), the reads move to the
	// replicas, a replica takes over when the primary dies, and then the users table is cut into
	// two shards by the first letter of the name. No interaction, it plays itself.
	import Guide from '$lib/components/Guide.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ReplicationText } from '$lib/chapters/web/replication/types';

	let { text, beat = 0, oncomplete, onshow }: StageProps = $props();
	const tx = $derived(text as ReplicationText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const clock = sceneClock(() => step, 60);
	const after = (ms: number) => clock.reduced || clock.t > ms;

	// Where things sit (viewBox units). A cylinder is drawn around its centre.
	type Pt = { x: number; y: number };
	const APP_Y = 46;
	const ONE: Pt = { x: 180, y: 160 };
	const PRI: Pt = { x: 180, y: 140 };
	const R1: Pt = { x: 75, y: 232 };
	const R2: Pt = { x: 285, y: 232 };
	const S1: Pt = { x: 95, y: 196 };
	const S2: Pt = { x: 265, y: 196 };
	const MID: Pt = { x: 180, y: 196 };

	const top = (p: Pt, dx = 0): Pt => ({ x: p.x + dx, y: p.y - 26 });
	const app = (dx: number): Pt => ({ x: 180 + dx, y: APP_Y });

	type Kind = 'read' | 'write' | 'copy';
	type Pkt = { a: Pt; b: Pt; kind: Kind; delay: number; dur: number };
	/** `count` dots on one path, already spread along it when the scene starts. */
	function stream(a: Pt, b: Pt, kind: Kind, count: number, dur: number, offset = 0): Pkt[] {
		return Array.from({ length: count }, (_, i) => ({
			a,
			b,
			kind,
			dur,
			delay: -((i * dur) / count + offset)
		}));
	}

	const failed = $derived(step === 5);
	const promotedOn = $derived(failed && after(1200));

	const packets = $derived.by<Pkt[]>(() => {
		const s = step;
		if (s <= 1)
			return [
				...stream(app(-12), top(ONE, -10), 'read', 6, 1.6),
				...stream(app(12), top(ONE, 10), 'write', 1, 1.6, 0.8)
			];
		if (s === 2)
			return [
				...stream(app(-12), top(PRI, -10), 'read', 6, 1.6),
				...stream(app(12), top(PRI, 10), 'write', 1, 1.6, 0.8)
			];
		const copies = (from: Pt, dur = 1.6) => [
			...stream({ x: from.x - 26, y: from.y + 12 }, top(R1, 10), 'copy', 1, dur),
			...stream({ x: from.x + 26, y: from.y + 12 }, top(R2, -10), 'copy', 1, dur)
		];
		if (s === 3)
			return [
				...stream(app(-12), top(PRI, -10), 'read', 5, 1.6),
				...stream(app(12), top(PRI, 10), 'write', 1, 1.6, 0.8),
				...copies(PRI)
			];
		if (s === 4)
			return [
				...stream(app(-24), top(R1, 6), 'read', 3, 2),
				...stream(app(24), top(R2, -6), 'read', 3, 2, 0.3),
				...stream(app(0), top(PRI), 'write', 1, 1.6, 0.8),
				...copies(PRI)
			];
		if (s === 5) {
			if (!promotedOn) return stream(app(24), top(R2, -6), 'read', 3, 2, 0.3);
			return [
				...stream(app(-24), top(R1, 6), 'write', 1, 2),
				...stream(app(24), top(R2, -6), 'read', 3, 2, 0.3),
				...stream({ x: R1.x + 32, y: R1.y }, { x: R2.x - 32, y: R2.y }, 'copy', 1, 2, 1)
			];
		}
		if (s === 9)
			return [
				...stream(app(0), top(PRI), 'write', 1, 3.5, 1.2),
				...stream({ x: PRI.x - 26, y: PRI.y + 12 }, top(R1, 10), 'copy', 1, 3.5),
				...stream({ x: PRI.x + 26, y: PRI.y + 12 }, top(R2, -10), 'copy', 1, 3.5, -0.9)
			];
		return [];
	});
	/** The faint wires under the dots, one per distinct path. */
	const wires = $derived.by(() => {
		const seen = new SvelteMap<string, Pkt>();
		for (const p of packets) seen.set(`${p.a.x},${p.a.y},${p.b.x},${p.b.y}`, p);
		return [...seen.entries()];
	});

	// Which databases are on screen, and how busy each one is (0 to 1).
	const showMain = $derived(step <= 5 || step === 9);
	const showReplicas = $derived((step >= 3 && step <= 5) || step === 9);
	const showShards = $derived(step === 6 || step === 7);
	const summary = $derived(step === 8);
	const mainAt = $derived(step <= 1 ? ONE : PRI);
	const mainLoad = $derived(
		step === 0
			? clock.reduced
				? 0.95
				: Math.min(0.95, 0.3 + clock.t / 5000)
			: step <= 3
				? 0.95
				: failed
					? 0
					: 0.4
	);
	const repLoad = $derived(step === 3 ? 0.1 : failed ? 0.6 : 0.45);
	const legendOn = $derived((step >= 1 && step <= 5) || step === 9);

	// Sharding, the big table first, then it splits into two shards.
	const split = $derived(step === 7 || after(1500));
	const userIdx = $derived(clock.reduced ? 0 : Math.floor(clock.t / 2600) % 2);
	const atApp = $derived(!clock.reduced && clock.t % 2600 < 350);
	const userPos = $derived<Pt>(
		atApp ? { x: 180, y: 70 } : userIdx === 0 ? { x: S1.x, y: 140 } : { x: S2.x, y: 140 }
	);
	const userName = $derived(tx.users[userIdx]);

	// The lag scene, the far replica is a little behind for most of each round.
	const lagging = $derived(clock.reduced || clock.t % 3500 < 2500);

	const meterW = (v: number) => Math.max(0, Math.min(1, v)) * 52;
	const meterTone = (v: number) => (v > 0.85 ? 'hot' : v > 0.55 ? 'warm' : 'cool');
</script>

{#snippet cylinder(cls: string, rx = 30)}
	<path d="M{-rx} -16 V16 A{rx} 8 0 0 0 {rx} 16 V-16" class="body {cls}" />
	<ellipse cx="0" cy="-16" {rx} ry="8" class="lid {cls}" />
	<path d="M{-rx} 0 A{rx} 8 0 0 0 {rx} 0" class="ring {cls}" />
{/snippet}

{#snippet meter(v: number)}
	<rect x="-26" y="44" width="52" height="5" rx="2.5" class="mbg" />
	<rect x="-26" y="44" width={meterW(v)} height="5" rx="2.5" class="mfill {meterTone(v)}" />
{/snippet}

{#snippet visual()}
	<div class="vis">
		<svg viewBox="0 0 360 300" class="pic" role="img" aria-label={tx.steps[step].title}>
			<!-- the app server on top -->
			<g class="fade" class:gone={summary}>
				<rect x="105" y="6" width="150" height="40" rx="10" class="app" />
				<circle cx="122" cy="26" r="3.5" class="led" />
				<text x="186" y="30" text-anchor="middle" class="appT">{tx.appLabel}</text>
			</g>

			<!-- wires and traffic -->
			{#each wires as [k, w] (k)}
				<line x1={w.a.x} y1={w.a.y} x2={w.b.x} y2={w.b.y} class="wire {w.kind}" />
			{/each}
			{#key step + (promotedOn ? 0.5 : 0)}
				{#each packets as p, n (n)}
					<circle
						r="4.5"
						class="pkt {p.kind}"
						class:still={clock.reduced}
						style={clock.reduced
							? `transform: translate(${(p.a.x + p.b.x) / 2}px, ${(p.a.y + p.b.y) / 2}px)`
							: `--x1:${p.a.x}px;--y1:${p.a.y}px;--x2:${p.b.x}px;--y2:${p.b.y}px;animation-duration:${p.dur}s;animation-delay:${p.delay}s`}
					/>
				{/each}
			{/key}

			<!-- the main database, later the primary -->
			<g
				class="mover fade"
				class:gone={!showMain}
				style="transform: translate({mainAt.x}px, {mainAt.y}px)"
			>
				{@render cylinder(failed ? 'dead' : step >= 2 ? 'pri' : '')}
				<text y="38" text-anchor="middle" class="lbl">{step <= 1 ? tx.dbLabel : tx.primary}</text>
				{#if failed}
					<path d="M-9 -9 L9 9 M9 -9 L-9 9" class="cross" />
					<rect x="38" y="-30" width="40" height="16" rx="8" class="tagbg bad" />
					<text x="58" y="-19" text-anchor="middle" class="tagT bad">{tx.down}</text>
				{:else}
					{@render meter(mainLoad)}
				{/if}
			</g>

			<!-- two replicas -->
			{#each [R1, R2] as r, k (k)}
				{@const promoted = k === 0 && promotedOn}
				<g
					class="mover fade"
					class:gone={!showReplicas}
					style="transform: translate({r.x}px, {showReplicas ? r.y : r.y - 40}px)"
				>
					{@render cylinder(promoted ? 'pri' : 'rep')}
					<text y="38" text-anchor="middle" class="lbl" class:hot={promoted}
						>{promoted ? tx.promoted : tx.replica}</text
					>
					{@render meter(repLoad)}
					{#if step === 9 && k === 1}
						<rect
							x="-40"
							y="-52"
							width="80"
							height="16"
							rx="8"
							class="tagbg {lagging ? 'warn' : 'ok'}"
						/>
						<text y="-41" text-anchor="middle" class="tagT {lagging ? 'warn' : 'ok'}"
							>{lagging ? tx.lag : tx.caughtUp}</text
						>
					{/if}
				</g>
			{/each}

			<!-- sharding, the big table and then two shards -->
			{#if showShards}
				<g class="fade" class:gone={split} transform="translate({MID.x} {MID.y - 20})">
					{@render cylinder('big', 64)}
					<text y="0" text-anchor="middle" class="inner">users</text>
					<rect x="-78" y="34" width="156" height="18" rx="9" class="tagbg bad" />
					<text y="47" text-anchor="middle" class="tagT bad">{tx.tooBig}</text>
				</g>
				{#each [S1, S2] as s, k (k)}
					{@const hit = step === 7 && !atApp && userIdx === k}
					<g
						class="mover fade"
						class:gone={!split}
						style="transform: translate({split ? s.x : MID.x}px, {s.y}px)"
					>
						{@render cylinder(hit ? 'pri' : 'rep')}
						<text y="4" text-anchor="middle" class="inner">users</text>
						<text y="38" text-anchor="middle" class="lbl" class:hot={hit}>{tx.shard} {k + 1}</text>
						<text y="54" text-anchor="middle" class="range" class:hot={hit}>{tx.ranges[k]}</text>
					</g>
				{/each}
				{#if step === 7}
					<g
						class="user"
						class:snap={atApp}
						style="transform: translate({userPos.x}px, {userPos.y}px)"
					>
						<rect x="-30" y="-11" width="60" height="22" rx="11" class="ubg" />
						<text y="4" text-anchor="middle" class="uT"
							><tspan class="first">{userName.charAt(0)}</tspan>{userName.slice(1)}</text
						>
					</g>
				{/if}
			{/if}

			<!-- the remember scene, photocopier on the left, scissors on the right -->
			{#if summary}
				<g class="sum">
					<text x="90" y="34" text-anchor="middle" class="memT">{tx.memory.copy}</text>
					<g transform="translate(90 96) scale(0.8)">{@render cylinder('pri')}</g>
					<g transform="translate(48 196) scale(0.8)">{@render cylinder('rep')}</g>
					<g transform="translate(132 196) scale(0.8)">{@render cylinder('rep')}</g>
					<path d="M78 120 L56 166 M102 120 L124 166" class="wire copy" />

					<line x1="180" y1="30" x2="180" y2="270" class="divider" />

					<text x="270" y="34" text-anchor="middle" class="memT">{tx.memory.cut}</text>
					<g transform="translate(270 96) scale(0.8)">{@render cylinder('big', 52)}</g>
					<path d="M262 128 L236 166 M278 128 L304 166" class="wire read" />
					<g transform="translate(228 196) scale(0.8)">{@render cylinder('rep')}</g>
					<g transform="translate(312 196) scale(0.8)">{@render cylinder('rep')}</g>
					<text x="228" y="236" text-anchor="middle" class="range">{tx.ranges[0]}</text>
					<text x="312" y="236" text-anchor="middle" class="range">{tx.ranges[1]}</text>
				</g>
			{/if}
		</svg>

		<div class="legend" class:off={!legendOn}>
			<span><i class="read"></i>{tx.read}</span>
			<span><i class="write"></i>{tx.write}</span>
			<span class:off={step < 3}><i class="copy"></i>{tx.copy}</span>
		</div>
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
		padding: 0 4px 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		max-width: 420px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 58vh;
		overflow: visible;
	}
	.fade {
		transition: opacity 0.5s;
	}
	.fade.gone {
		opacity: 0;
	}
	.mover {
		transition:
			transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.5s;
	}
	.app {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.led {
		fill: var(--color-grass);
	}
	.appT {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}

	.body,
	.lid {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.6;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.lid {
		fill: var(--color-paper);
	}
	.ring {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.body.pri,
	.lid.pri {
		stroke: var(--color-brand);
	}
	.body.pri {
		fill: var(--color-brand-soft);
	}
	.body.rep,
	.lid.rep {
		stroke: var(--color-grass);
	}
	.body.rep {
		fill: var(--color-grass-soft);
	}
	.body.dead,
	.lid.dead {
		stroke: var(--color-danger);
	}
	.body.dead {
		fill: var(--color-danger-soft);
	}
	.body.big,
	.lid.big {
		stroke: var(--color-amber);
	}
	.body.big {
		fill: var(--color-amber-soft);
	}
	.cross {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.lbl {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.lbl.hot,
	.range.hot {
		fill: var(--color-brand);
	}
	.inner {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.range {
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.mbg {
		fill: var(--color-line);
	}
	.mfill {
		transition:
			width 0.6s,
			fill 0.4s;
	}
	.mfill.cool {
		fill: var(--color-grass);
	}
	.mfill.warm {
		fill: var(--color-amber);
	}
	.mfill.hot {
		fill: var(--color-danger);
	}
	.tagbg {
		stroke-width: 1.2;
	}
	.tagbg.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.tagbg.warn {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.tagbg.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.tagT {
		font-size: 9.5px;
		font-weight: 800;
	}
	.tagT.bad {
		fill: var(--color-danger);
	}
	.tagT.warn {
		fill: var(--color-ink);
	}
	.tagT.ok {
		fill: var(--color-grass);
	}

	.wire {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
		fill: none;
	}
	.wire.copy {
		stroke: color-mix(in srgb, var(--color-grass) 40%, var(--color-line));
	}
	.pkt {
		animation-name: fly;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.pkt.still {
		animation: none;
	}
	.pkt.read {
		fill: var(--color-brand);
	}
	.pkt.write {
		fill: var(--color-amber);
	}
	.pkt.copy {
		fill: var(--color-grass);
	}
	@keyframes fly {
		0% {
			transform: translate(var(--x1), var(--y1));
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			transform: translate(var(--x2), var(--y2));
			opacity: 0;
		}
	}

	.user {
		transition: transform 1s cubic-bezier(0.45, 0, 0.3, 1);
	}
	.user.snap {
		transition: none;
	}
	.ubg {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.uT {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.first {
		font-weight: 900;
		fill: var(--color-brand);
	}

	.memT {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.divider {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
		transition: opacity 0.4s;
	}
	.legend.off,
	.legend .off {
		opacity: 0;
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		transition: opacity 0.4s;
	}
	.legend i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.legend i.read {
		background: var(--color-brand);
	}
	.legend i.write {
		background: var(--color-amber);
	}
	.legend i.copy {
		background: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.fade,
		.mover,
		.user,
		.mfill,
		.body,
		.lid,
		.legend,
		.legend span {
			transition: none;
		}
	}
</style>
