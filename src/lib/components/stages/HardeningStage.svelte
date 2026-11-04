<script lang="ts">
	// Guided "watch" stage. A fresh nimbus.com server stands with six open doors (ports) while bots
	// on the left keep knocking. Following Nim's beats the scanner gauge appears, the old software
	// gets updated, the unneeded doors shut one by one, the admin door gets a key lock and the
	// website door stays open on purpose, so the score climbs by itself. The only optional play,
	// on the last beat, is opening Telnet again and watching the bots rush to it.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HardenDoor, HardeningText } from '$lib/chapters/security/hardening/types';
	import { sceneClock } from './shipit/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HardeningText);

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

	let reopened = $state(false);
	function toggle() {
		reopened = !reopened;
		onstate?.(reopened ? 'reopen' : 'reclose');
	}

	const clock = sceneClock(() => [step, reopened]);

	type Door = { k: HardenDoor; port: string; x: number; y: number };
	const DOORS: Door[] = [
		{ k: 'ftp', port: '21', x: 114, y: 140 },
		{ k: 'ssh', port: '22', x: 192, y: 140 },
		{ k: 'telnet', port: '23', x: 270, y: 140 },
		{ k: 'web', port: '443', x: 114, y: 236 },
		{ k: 'db', port: '3306', x: 192, y: 236 },
		{ k: 'test', port: '8080', x: 270, y: 236 }
	];
	const DW = 56;
	const DH = 62;
	/** The doors that get shut, in the order they close on the "close" beat. */
	const CLOSE: HardenDoor[] = ['ftp', 'telnet', 'db', 'test'];

	const updated = $derived(step > 3 || (step === 3 && clock.t >= 1600));
	const keyed = $derived(step > 5 || (step === 5 && clock.t >= 1200));
	const guarded = $derived(step >= 6);
	const telnetBack = $derived(live && reopened);

	function isClosed(k: HardenDoor): boolean {
		const i = CLOSE.indexOf(k);
		if (i < 0) return false;
		if (k === 'telnet' && telnetBack) return false;
		if (step > 4) return true;
		if (step === 4) return clock.t >= 1000 + i * 1400;
		return false;
	}
	type DoorState = 'open' | 'closed' | 'keyed' | 'guarded';
	function doorState(k: HardenDoor): DoorState {
		if (k === 'ssh') return keyed ? 'keyed' : 'open';
		if (k === 'web') return guarded ? 'guarded' : 'open';
		return isClosed(k) ? 'closed' : 'open';
	}

	const showScore = $derived(step >= 2);
	const score = $derived.by(() => {
		const closed = CLOSE.filter(isClosed).length;
		let s = 16 + (updated ? 22 : 0) + closed * 10 + (keyed ? 14 : 0) + (guarded ? 6 : 0);
		if (telnetBack) s -= 16;
		return s;
	});
	const scoreTone = $derived(score < 50 ? 'bad' : score < 80 ? 'mid' : 'good');

	// Bots on the left, each one sends a knock to a door every couple of seconds.
	const BOTS = [168, 248, 318];
	const PERIOD = 2200;
	type Knock = { x: number; y: number; o: number; hit: boolean; k: HardenDoor };
	const knocks = $derived.by((): Knock[] => {
		if (step < 1 || clock.reduced) return [];
		return BOTS.map((by, b) => {
			const time = clock.t + b * 730;
			const cycle = Math.floor(time / PERIOD);
			const p = (time % PERIOD) / PERIOD;
			const door = telnetBack ? DOORS[2] : DOORS[(cycle * 5 + b * 2) % DOORS.length];
			const dx = door.x + DW / 2;
			const dy = door.y + DH / 2;
			const open = doorState(door.k) === 'open';
			const go = Math.min(p / 0.6, 1);
			let x = 50 + (dx - 50) * go;
			let o = 1;
			if (p > 0.6) {
				const r = (p - 0.6) / 0.4;
				o = 1 - r;
				if (!open) x = dx - 22 * r;
			}
			return { x, y: by + (dy - by) * go, o, hit: open && p > 0.6, k: door.k };
		});
	});
	const hitDoors = $derived(new Set(knocks.filter((k) => k.hit).map((k) => k.k)));

	// Semicircle gauge, drawn with pathLength 100 so the dash equals the score.
	const ARC = 'M184 66 A36 36 0 0 1 256 66';
</script>

{#snippet lock(cx: number, cy: number)}
	<g transform="translate({cx - 7} {cy - 8})" class="lock">
		<rect x="0" y="6" width="14" height="11" rx="2" />
		<path d="M3 6V4a4 4 0 0 1 8 0v2" />
	</g>
{/snippet}

{#snippet visual(i: number)}
	<div class="vis">
		{#if live}
			<button type="button" class="play" class:warn={!reopened} onclick={toggle}>
				{reopened ? tx.reclose : tx.reopen}
			</button>
		{/if}
		<svg viewBox="0 0 360 362" class="scene" role="img" aria-label={tx.steps[i].title}>
			<!-- the scanner gauge -->
			{#if showScore}
				<g class="gauge {scoreTone}">
					<path d={ARC} class="track" pathLength="100" />
					<path d={ARC} class="fillarc" pathLength="100" style="stroke-dasharray:{score} 100" />
					<text x="220" y="62" text-anchor="middle" class="score">{score}</text>
					<text x="220" y="82" text-anchor="middle" class="cap">{tx.scoreLabel}</text>
				</g>
			{/if}

			<!-- the server cabinet -->
			<rect x="96" y="92" width="248" height="246" rx="14" class="cabinet" />
			{#if step === 2 && !clock.reduced}
				<rect x="98" y="94" width="4" height="242" rx="2" class="sweep" />
			{/if}
			<rect x="114" y="102" width="212" height="24" rx="7" class="plate" />
			<text x="124" y="118" class="soft">{tx.software}</text>
			{#key updated}
				<g class:pop={step === 3}>
					<rect
						x="252"
						y="107"
						width="66"
						height="14"
						rx="7"
						class={updated ? 'pill good' : 'pill old'}
					/>
					<text x="285" y="117.5" text-anchor="middle" class="pillT"
						>{updated ? tx.patched : tx.outdated}</text
					>
				</g>
			{/key}

			{#each DOORS as d (d.k)}
				{@const s = doorState(d.k)}
				<rect x={d.x} y={d.y} width={DW} height={DH} rx="4" class="frame" />
				{#if s === 'open' || s === 'guarded'}
					<rect
						x={d.x + 3}
						y={d.y + 3}
						width={DW - 6}
						height={DH - 3}
						rx="2"
						class="dark"
						class:hit={hitDoors.has(d.k)}
						class:guard={s === 'guarded'}
					/>
					<path
						d="M{d.x + 3} {d.y + 3}L{d.x + 17} {d.y + 9}V{d.y + DH - 6}L{d.x + 3} {d.y + DH}Z"
						class="leaf"
					/>
				{:else}
					<rect
						x={d.x + 3}
						y={d.y + 3}
						width={DW - 6}
						height={DH - 3}
						rx="2"
						class="panel shut"
						class:keyed={s === 'keyed'}
					/>
					{#if s === 'keyed'}
						{@render lock(d.x + DW / 2, d.y + DH / 2)}
					{:else}
						<circle cx={d.x + DW - 12} cy={d.y + DH / 2 + 2} r="3" class="knob" />
					{/if}
				{/if}
				<text x={d.x + DW / 2} y={d.y + DH + 14} text-anchor="middle" class="port">{d.port}</text>
				<text x={d.x + DW / 2} y={d.y + DH + 26} text-anchor="middle" class="dname"
					>{tx.doors[d.k]}</text
				>
			{/each}
			<text x="220" y="356" text-anchor="middle" class="cap">{tx.serverLabel}</text>

			<!-- the bots and their knocks -->
			{#if step >= 1}
				<text x="34" y="140" text-anchor="middle" class="cap">{tx.botsLabel}</text>
				{#each BOTS as by (by)}
					<g transform="translate(34 {by})" class="bot">
						<line x1="0" y1="-12" x2="0" y2="-18" />
						<circle cx="0" cy="-19" r="2.2" class="tip" />
						<rect x="-14" y="-12" width="28" height="22" rx="6" />
						<circle cx="-5" cy="-1" r="2.6" class="eye" />
						<circle cx="5" cy="-1" r="2.6" class="eye" />
					</g>
				{/each}
				{#each knocks as k, n (n)}
					<circle cx={k.x} cy={k.y} r="4" class="knock" style="opacity:{k.o}" />
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
		max-width: 400px;
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

	.cabinet {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.sweep {
		fill: var(--color-brand);
		opacity: 0.6;
		animation: sweep 2.6s ease-in-out infinite;
	}
	.plate {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.soft {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.pill.old {
		fill: var(--color-amber);
	}
	.pill.good {
		fill: var(--color-grass);
	}
	.pillT {
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.frame {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.dark {
		fill: var(--color-ink);
		opacity: 0.72;
		transition: fill 0.25s;
	}
	.dark.hit {
		fill: var(--color-danger);
	}
	.dark.guard {
		fill: var(--color-brand-soft);
		opacity: 1;
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.leaf {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.panel {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.panel.keyed {
		stroke: var(--color-brand);
	}
	.shut {
		transform-box: fill-box;
		transform-origin: left center;
		animation: shut 0.5s ease-out both;
	}
	.knob {
		fill: var(--color-grass);
	}
	.lock rect {
		fill: var(--color-brand);
	}
	.lock path {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.2;
	}
	.port {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.dname {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.track {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 9;
		stroke-linecap: round;
	}
	.fillarc {
		fill: none;
		stroke-width: 9;
		stroke-linecap: round;
		transition:
			stroke-dasharray 0.7s ease,
			stroke 0.4s;
	}
	.gauge.bad .fillarc {
		stroke: var(--color-danger);
	}
	.gauge.mid .fillarc {
		stroke: var(--color-amber);
	}
	.gauge.good .fillarc {
		stroke: var(--color-grass);
	}
	.score {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.bot rect {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.bot line {
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.bot .tip {
		fill: var(--color-danger);
	}
	.bot .eye {
		fill: var(--color-danger);
	}
	.knock {
		fill: var(--color-danger);
	}
	.pop {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.45s ease-out both;
	}
	@keyframes sweep {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(236px);
		}
	}
	@keyframes shut {
		from {
			transform: scaleX(0.25);
		}
		to {
			transform: scaleX(1);
		}
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
	@media (prefers-reduced-motion: reduce) {
		.sweep,
		.shut,
		.pop {
			animation: none;
		}
		.fillarc,
		.dark {
			transition: none;
		}
	}
</style>
