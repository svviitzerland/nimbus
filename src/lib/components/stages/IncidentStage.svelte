<script lang="ts">
	// Guided "watch" stage. Five computers hang off one network switch. First they are Maersk's
	// and go black one after another (NotPetya), with the lone offline server in Ghana surviving.
	// Then they are nimbus.com's, an alarm rings, and the incident is walked through in the right
	// order by itself, beat by beat (check, contain, clean, recover, learn), with a row of steps
	// filling in under the scene. The only optional play, on the last beat, is replaying it while
	// skipping the containing step, and watching the malware spread in the meantime.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { IncidentPhase, IncidentText } from '$lib/chapters/security/incident/types';
	import { sceneClock } from './shipit/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as IncidentText);

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
	const live = $derived(beat >= tx.intro.length - 1 && peek === null);

	type Run = 'skip' | 'right';
	let run = $state<Run | null>(null);
	let runId = $state(0);
	function replay() {
		run = run === 'skip' ? 'right' : 'skip';
		runId += 1;
		onstate?.(run);
	}
	$effect(() => {
		if (!live) untrack(() => (run = null));
	});

	const clock = sceneClock(() => [step, runId]);

	const PHASES: IncidentPhase[] = ['check', 'contain', 'clean', 'recover', 'learn'];
	const CX = [44, 122, 200, 278, 356];
	const T = 1; // the machine that gets hit at nimbus.com
	const SWX = 200;
	const SWY = 142;

	type MS = 'ok' | 'dark' | 'sick' | 'blank' | 'restore';
	type Pulse = { k: number; p: number; out: boolean };
	type Scene = {
		maersk: boolean;
		states: MS[];
		cut: boolean;
		pulses: Pulse[];
		mag: boolean;
		ghana: boolean;
		flow: number;
		notes: number;
		phase: number;
		skipped: boolean;
		bell: boolean;
	};

	const loop = (t: number, from: number, ms = 1600) => ((t - from) % ms) / ms;

	function base(): Scene {
		return {
			maersk: false,
			states: CX.map(() => 'ok' as MS),
			cut: false,
			pulses: [],
			mag: false,
			ghana: false,
			flow: 0,
			notes: 0,
			phase: -1,
			skipped: false,
			bell: false
		};
	}

	function rightRun(t: number): Scene {
		const s = base();
		s.states[T] = 'sick';
		s.bell = t < 4500;
		if (t >= 500) {
			s.mag = t < 1300;
			s.phase = 0;
		}
		if (t >= 1300) {
			s.cut = true;
			s.phase = 1;
		}
		if (t >= 2300) {
			s.states[T] = 'blank';
			s.phase = 2;
		}
		if (t >= 3300) {
			s.states[T] = 'restore';
			s.flow = Math.min(1, (t - 3300) / 1200);
			s.phase = 3;
		}
		if (t >= 4500) {
			s.states[T] = 'ok';
			s.cut = false;
			s.flow = 0;
			s.phase = 4;
		}
		if (t >= 4900) s.notes = Math.min(3, Math.floor((t - 4900) / 500) + 1);
		if (t >= 6400) s.phase = 5;
		return s;
	}

	function skipRun(t: number): Scene {
		const s = base();
		s.states[T] = 'sick';
		s.bell = true;
		s.skipped = true;
		if (t >= 500) {
			s.mag = t < 1300;
			s.phase = 0;
		}
		if (t >= 1300) {
			s.states[T] = 'blank';
			s.phase = 2;
		}
		if (t >= 1000 && t < 1600) s.pulses = [{ k: T, p: (t - 1000) / 600, out: true }];
		if (t >= 1600 && t < 2400)
			s.pulses = [0, 2].map((k) => ({ k, p: (t - 1600) / 800, out: false }));
		if (t >= 2400) {
			s.states[0] = 'sick';
			s.states[2] = 'sick';
		}
		if (t >= 3200) {
			s.states[T] = 'restore';
			s.flow = Math.min(1, (t - 3200) / 1100);
			s.phase = 3;
		}
		if (t >= 4300) {
			s.states[T] = 'ok';
			s.flow = 0;
		}
		if (t >= 4500 && t < 5100) s.pulses = [{ k: 2, p: (t - 4500) / 600, out: true }];
		if (t >= 5100 && t < 5800) s.pulses = [{ k: T, p: (t - 5100) / 700, out: false }];
		if (t >= 5800) s.states[T] = 'sick';
		return s;
	}

	const scene = $derived.by((): Scene => {
		const t = clock.t;
		const s = base();
		if (live && run) return run === 'skip' ? skipRun(t) : rightRun(t);
		switch (step) {
			case 0:
				s.maersk = true;
				s.states = CX.map((_, k) => (t >= 700 + k * 650 ? 'dark' : 'ok'));
				return s;
			case 1:
				s.maersk = true;
				s.states = CX.map(() => 'dark');
				s.ghana = true;
				return s;
			case 2:
			case 3:
				if (t >= 600 || step === 3) {
					s.states[T] = 'sick';
					s.bell = true;
				}
				if (t >= 900 || step === 3) s.pulses = [{ k: T, p: loop(t, 900), out: true }];
				if (step === 3) {
					s.mag = true;
					s.phase = 0;
				}
				return s;
			case 4:
				s.states[T] = 'sick';
				s.bell = true;
				s.phase = 1;
				s.cut = t >= 800;
				if (!s.cut) s.pulses = [{ k: T, p: loop(t, 0), out: true }];
				return s;
			case 5:
				s.cut = true;
				s.states[T] = t < 700 ? 'sick' : 'blank';
				s.phase = 2;
				return s;
			case 6:
				s.cut = t < 2600;
				s.states[T] = t < 300 ? 'blank' : t < 2400 ? 'restore' : 'ok';
				s.flow = t >= 300 && t < 2400 ? (t - 300) / 2100 : 0;
				s.phase = 3;
				return s;
			case 7:
				s.phase = 4;
				s.notes = Math.max(0, Math.min(3, Math.floor((t - 400) / 800) + 1));
				return s;
			default:
				s.phase = 5;
				s.notes = 3;
				return s;
		}
	});

	function pulseXY(q: Pulse) {
		const p = q.out ? q.p : 1 - q.p;
		return { x: CX[q.k] + (SWX - CX[q.k]) * p, y: 81 + (SWY - 81) * p };
	}
	const showTracker = $derived(!scene.maersk);
	function phaseLook(n: number): string {
		const s = scene;
		if (s.skipped && n === 1) return 'skipped';
		if (n < s.phase) return 'done';
		if (n === s.phase) return 'on';
		return '';
	}
</script>

{#snippet machine(k: number, st: MS)}
	{@const cx = CX[k]}
	<rect x={cx - 28} y="30" width="56" height="40" rx="5" class="mon" class:alarm={st === 'sick'} />
	<rect x={cx - 24} y="34" width="48" height="31" rx="2" class="scr {st}" />
	{#if st === 'ok'}
		<rect x={cx - 18} y="40" width="26" height="4" rx="2" class="bar" />
		<rect x={cx - 18} y="48" width="34" height="4" rx="2" class="bar" />
		<rect x={cx - 18} y="56" width="18" height="4" rx="2" class="bar" />
	{:else if st === 'dark'}
		<text x={cx} y="53" text-anchor="middle" class="oops">Oops</text>
	{:else if st === 'sick'}
		<g transform="translate({cx} 49)" class="bug">
			<ellipse rx="6" ry="7.5" />
			<path d="M-6 -3h-5M-6 3h-5M6 -3h5M6 3h5M-3 -7l-3 -4M3 -7l3 -4" />
		</g>
	{:else if st === 'blank'}
		<rect x={cx - 24} y="34" width="10" height="31" class="wipe" />
	{:else}
		<rect x={cx - 18} y="47" width="36" height="5" rx="2.5" class="track" />
		<rect x={cx - 18} y="47" width={36 * scene.flow} height="5" rx="2.5" class="prog" />
	{/if}
	<rect x={cx - 4} y="70" width="8" height="8" class="stand" />
	<rect x={cx - 13} y="78" width="26" height="3" rx="1.5" class="stand" />
{/snippet}

{#snippet visual(i: number)}
	{@const s = scene}
	<div class="vis">
		{#if live}
			<button type="button" class="play" class:warn={run !== 'skip'} onclick={replay}>
				{run === 'skip' ? tx.right : tx.skip}
			</button>
		{/if}
		<svg viewBox="0 0 400 292" class="scene" role="img" aria-label={tx.steps[i].title}>
			<text x="12" y="16" class="title">{s.maersk ? tx.maersk : tx.nimbus}</text>
			{#if s.bell}
				<g transform="translate(384 11)" class="bell">
					<path d="M0 -8l9 15h-18Z" />
					<text y="5" text-anchor="middle" class="bang">!</text>
				</g>
			{/if}

			<!-- cables to the switch -->
			{#each CX as cx, k (k)}
				{#if s.cut && k === T}
					<line
						x1={cx}
						y1="81"
						x2={cx + (SWX - cx) * 0.38}
						y2={81 + (SWY - 81) * 0.38}
						class="cable"
					/>
					<line
						x1={cx + (SWX - cx) * 0.62}
						y1={81 + (SWY - 81) * 0.62}
						x2={SWX}
						y2={SWY}
						class="cable"
					/>
				{:else}
					<line x1={cx} y1="81" x2={SWX} y2={SWY} class="cable" class:dead={s.maersk} />
				{/if}
			{/each}
			<rect x="156" y={SWY} width="88" height="20" rx="5" class="switch" />
			{#each [0, 1, 2, 3, 4] as n (n)}
				<circle cx={172 + n * 14} cy={SWY + 10} r="2.6" class="sled" class:off={s.maersk} />
			{/each}

			{#each [0, 1, 2, 3, 4] as k (k)}
				{@render machine(k, s.states[k])}
			{/each}

			{#if s.cut}
				<circle cx={CX[T]} cy="54" r="40" class="shield" />
			{/if}

			{#each s.pulses as q, n (n)}
				{@const xy = pulseXY(q)}
				<circle cx={xy.x} cy={xy.y} r="4.5" class="pulse" />
			{/each}

			{#if s.mag}
				<g class="mag">
					<circle cx={CX[T] + 10} cy="50" r="17" />
					<line x1={CX[T] + 22} y1="62" x2={CX[T] + 32} y2="72" />
				</g>
				<rect x={CX[T] - 48} y="94" width="96" height="17" rx="8.5" class="tag" />
				<text x={CX[T]} y="106" text-anchor="middle" class="tagT">{tx.checkTag}</text>
			{/if}

			<!-- the lone survivor in Ghana -->
			{#if s.ghana}
				<g class="ghana">
					<rect x="178" y="200" width="44" height="58" rx="6" class="rack" />
					{#each [210, 226, 242] as y (y)}
						<rect x="184" {y} width="32" height="11" rx="2" class="unit" />
						<circle cx="190" cy={y + 5.5} r="2.2" class="led" />
					{/each}
					<path d="M222 240h18q6 0 6 6v8" class="stub" />
					<rect x="241" y="254" width="10" height="8" rx="2" class="plug" />
					<rect x="140" y="182" width="120" height="16" rx="8" class="otag" />
					<text x="200" y="193.5" text-anchor="middle" class="otagT">{tx.offline}</text>
					<text x="200" y="276" text-anchor="middle" class="cap">{tx.ghana}</text>
				</g>
			{/if}

			<!-- backup drive and notebook, the nimbus.com part -->
			{#if !s.maersk}
				<g class="drive" class:on={s.flow > 0}>
					<ellipse cx="66" cy="214" rx="26" ry="7" />
					<path d="M40 214v34a26 7 0 0 0 52 0v-34" />
					<ellipse cx="66" cy="214" rx="26" ry="7" class="top" />
				</g>
				<text x="66" y="276" text-anchor="middle" class="cap">{tx.backup}</text>
				{#if s.flow > 0}
					<line x1="66" y1="206" x2={CX[T]} y2="84" class="flowline" />
					<circle
						cx={66 + (CX[T] - 66) * ((s.flow * 3) % 1)}
						cy={206 + (84 - 206) * ((s.flow * 3) % 1)}
						r="4"
						class="flowdot"
					/>
				{/if}

				<rect x="290" y="196" width="96" height="66" rx="6" class="paper" class:on={s.notes > 0} />
				{#each tx.lessons as l, n (n)}
					{#if n < s.notes}
						<g class="note">
							<path d="M298 {214 + n * 18}l3 3l6 -7" class="tick" />
							<text x="311" y={218 + n * 18} class="noteT">{l}</text>
						</g>
					{:else}
						<rect x="300" y={211 + n * 18} width="72" height="4" rx="2" class="bar" />
					{/if}
				{/each}
				<text x="338" y="276" text-anchor="middle" class="cap">{tx.notes}</text>
			{/if}
		</svg>

		{#if showTracker}
			<ol class="tracker">
				{#each PHASES as p, n (p)}
					<li class={phaseLook(n)}>
						<span class="num">{n + 1}</span>{tx.phases[p]}
					</li>
				{/each}
			</ol>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		justify-content: center;
		overflow-x: hidden;
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
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		display: block;
		width: 100%;
		max-width: 440px;
		height: auto;
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.warn {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.title {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.04em;
		fill: var(--color-muted);
	}
	.cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.bell path {
		fill: var(--color-danger);
	}
	.bell {
		animation: ring 0.5s ease-in-out infinite alternate;
	}
	.bang {
		font-size: 10px;
		font-weight: 900;
		fill: var(--color-card);
	}
	.cable {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.cable.dead {
		opacity: 0.5;
	}
	.switch {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.sled {
		fill: var(--color-grass);
	}
	.sled.off {
		fill: var(--color-line);
	}
	.mon {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.3s;
	}
	.mon.alarm {
		stroke: var(--color-danger);
	}
	.scr {
		transition: fill 0.4s;
	}
	.scr.ok,
	.scr.restore,
	.scr.blank {
		fill: var(--color-paper);
	}
	.scr.dark {
		fill: var(--color-ink);
	}
	.scr.sick {
		fill: var(--color-danger-soft);
	}
	.bar {
		fill: var(--color-line);
	}
	.oops {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-danger);
	}
	.bug ellipse {
		fill: var(--color-danger);
	}
	.bug path {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.bug {
		animation: wiggle 0.6s ease-in-out infinite alternate;
	}
	.wipe {
		fill: var(--color-brand-soft);
		animation: wipe 1.2s ease-in-out infinite alternate;
	}
	.track {
		fill: var(--color-line);
	}
	.prog {
		fill: var(--color-grass);
	}
	.stand {
		fill: var(--color-line);
	}
	.shield {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.5;
		opacity: 0.8;
		animation: fadein 0.4s ease-out both;
	}
	.pulse {
		fill: var(--color-danger);
	}
	.mag circle {
		fill: color-mix(in srgb, var(--color-brand) 10%, transparent);
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.mag line {
		stroke: var(--color-brand);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.mag {
		animation: fadein 0.4s ease-out both;
	}
	.tag {
		fill: var(--color-danger);
	}
	.tagT {
		font-size: 9.5px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.rack {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 2.5;
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.stub {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.plug {
		fill: var(--color-faint);
	}
	.otag {
		fill: var(--color-grass-soft);
	}
	.otagT {
		font-size: 10px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.ghana {
		animation: fadein 0.6s ease-out both;
	}
	.drive ellipse,
	.drive path {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.3s;
	}
	.drive.on ellipse,
	.drive.on path {
		stroke: var(--color-grass);
	}
	.flowline {
		stroke: var(--color-grass);
		stroke-width: 2;
		opacity: 0.35;
	}
	.flowdot {
		fill: var(--color-grass);
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.3s;
	}
	.paper.on {
		stroke: var(--color-brand);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.noteT {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.note {
		animation: fadein 0.4s ease-out both;
	}

	.tracker {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.tracker li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 4px 11px 4px 5px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-faint);
		transition:
			border-color 0.3s,
			color 0.3s,
			background 0.3s;
	}
	.num {
		display: inline-grid;
		height: 18px;
		width: 18px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-line);
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-card);
	}
	.tracker li.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.tracker li.on .num {
		background: var(--color-brand);
	}
	.tracker li.done {
		color: var(--color-grass);
	}
	.tracker li.done .num {
		background: var(--color-grass);
	}
	.tracker li.skipped {
		border-color: var(--color-danger);
		color: var(--color-danger);
		text-decoration: line-through;
	}
	.tracker li.skipped .num {
		background: var(--color-danger);
	}
	@keyframes ring {
		from {
			transform: translate(384px, 11px) rotate(-10deg);
		}
		to {
			transform: translate(384px, 11px) rotate(10deg);
		}
	}
	@keyframes wiggle {
		from {
			opacity: 0.75;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes wipe {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(38px);
		}
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bell,
		.bug,
		.wipe,
		.shield,
		.mag,
		.ghana,
		.note {
			animation: none;
		}
		.tracker li,
		.scr,
		.mon {
			transition: none;
		}
	}
</style>
