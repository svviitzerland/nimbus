<script lang="ts">
	// Guided troubleshooting lesson. The home network is a tower of six floors (cable at the
	// bottom, website at the top) next to a laptop that cannot open nimbus.com. Following the
	// beats, the tower builds up, falls together, then the bottom up checklist walks itself and
	// stops at the first red floor. On the last beat the learner may find one fault themselves.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CheckId, TroubleshootText } from '$lib/chapters/network/troubleshoot/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as TroubleshootText);

	const FLOORS: CheckId[] = ['cable', 'wifi', 'ip', 'gateway', 'dns', 'site'];
	const GATEWAY = 3;
	const STEP_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 6];
	const last = $derived(beat >= tx.intro.length - 1);

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});

	// ---- the optional case ----
	let playing = $state(false);
	let fault = $state(0);
	let checked = $state<boolean[]>(FLOORS.map(() => false));
	let solved = $state(false);
	function newCase() {
		let f = fault;
		while (f === fault) f = Math.floor(Math.random() * FLOORS.length);
		fault = f;
		checked = FLOORS.map(() => false);
		solved = false;
		playing = true;
		peek = null;
		onstate?.('start');
	}
	function check(i: number) {
		if (!playing || solved || checked[i]) return;
		checked[i] = true;
		const allBelow = FLOORS.slice(0, i).every((_, k) => checked[k]);
		if (i < fault) onstate?.('ok');
		else if (!allBelow) onstate?.('skip');
		else {
			solved = true;
			onstate?.('solved');
		}
	}

	const step = $derived(
		peek ?? (last && playing ? 7 : STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)])
	);
	const inPlay = $derived(step === 7 && playing);

	// ---- the walk on the bottom up beat ----
	let walked = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;
	$effect(() => {
		clearInterval(timer);
		if (step !== 3) return;
		const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			walked = GATEWAY + 1;
			return;
		}
		walked = 0;
		timer = setInterval(() => {
			walked += 1;
			if (walked > GATEWAY) clearInterval(timer);
		}, 1000);
		return () => clearInterval(timer);
	});

	type St = 'idle' | 'ok' | 'fail' | 'victim';
	function status(i: number): St {
		if (inPlay) {
			if (solved) return 'ok';
			if (!checked[i]) return 'idle';
			return i < fault ? 'ok' : i === fault ? 'fail' : 'victim';
		}
		if (step <= 1 || step === 7) return 'idle';
		if (step === 2) return i === 0 ? 'fail' : 'victim';
		if (step === 3) return i >= walked ? 'idle' : i < GATEWAY ? 'ok' : 'fail';
		if (step === 4) return i < GATEWAY ? 'ok' : i === GATEWAY ? 'fail' : 'victim';
		return 'ok';
	}
	const broken = $derived(inPlay ? !solved : step <= 4 || step === 7);
	const culprit = $derived(inPlay ? -1 : step === 4 ? GATEWAY : step === 2 ? 0 : -1);
	const here = $derived(step === 3 && walked <= GATEWAY ? walked : -1);
	const tagFor = (i: number, st: St) =>
		i === culprit
			? tx.culpritTag
			: st === 'victim' && (step === 4 || step === 2 || inPlay)
				? tx.victimTag
				: '';

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
		return () => clearInterval(timer);
	});
</script>

{#snippet scene(_: number)}
	<div class="scene">
		<div class="tower" class:sweep={step === 1} class:fall={step === 2}>
			{#if step === 6}<span class="mark top">{tx.endHere}</span>{/if}
			{#each FLOORS as id, i (id)}
				{@const st = status(i)}
				{@const tag = tagFor(i, st)}
				<button
					type="button"
					class="floor {st}"
					class:here={here === i}
					class:tap={inPlay && !solved}
					tabindex={inPlay && !solved ? 0 : -1}
					style="--i:{i}"
					onclick={() => check(i)}
				>
					<span class="dot"></span>
					<span class="txt">
						<b>{tx.checks[id].name}</b>
						<small
							>{st === 'ok'
								? tx.checks[id].ok
								: st === 'fail' || st === 'victim'
									? tx.checks[id].fail
									: tx.checks[id].how}</small
						>
					</span>
					{#if tag}<em class="tag" class:cul={i === culprit}>{tag}</em>{/if}
				</button>
			{/each}
			{#if step === 6 || (step === 3 && here === 0)}<span class="mark bottom">{tx.startHere}</span
				>{/if}
		</div>

		<div class="side">
			<div class="laptop">
				<div class="lid">
					<div class="screen">
						<div class="addr">nimbus.com</div>
						{#if broken}
							<div class="err">
								<svg viewBox="0 0 24 24" aria-hidden="true"
									><circle cx="12" cy="12" r="10" class="eo" /><path
										d="M8 8l8 8M16 8l-8 8"
										class="ex"
									/></svg
								>
								<span>{tx.pageError}</span>
							</div>
						{:else}
							<div class="page"><i class="h"></i><i></i><i class="s"></i></div>
						{/if}
					</div>
				</div>
				<div class="base"></div>
			</div>
			<svg viewBox="0 0 120 54" class="router" aria-hidden="true">
				<path d="M4 50 q20 0 26 -14" class="cable" class:cut={step === 2} />
				<line x1="44" y1="20" x2="40" y2="4" class="ant" />
				<line x1="86" y1="20" x2="90" y2="4" class="ant" />
				<rect x="30" y="20" width="70" height="20" rx="5" class="rbody" />
				{#each [0, 1, 2] as k (k)}
					<circle cx={44 + k * 10} cy="30" r="2.4" class="rled" class:off={broken} />
				{/each}
			</svg>
		</div>
	</div>
{/snippet}

<div class="flex max-h-full w-full flex-col items-center gap-3 overflow-y-auto pb-28 md:pb-0">
	{#if last && (!playing || solved)}
		<button type="button" class="play" onclick={newCase}>{playing ? tx.newCase : tx.playBtn}</button
		>
	{/if}
	<Guide steps={tx.steps} active={step} onselect={(i) => (peek = i)} visual={scene} />
	{#if inPlay && solved}
		<p class="fix">{tx.fixes[FLOORS[fault]]}</p>
	{/if}
</div>

<style>
	.scene {
		display: flex;
		width: 100%;
		max-width: 460px;
		align-items: flex-end;
		gap: 14px;
	}
	.tower {
		position: relative;
		display: flex;
		flex: 1;
		min-width: 0;
		flex-direction: column-reverse;
		gap: 5px;
		padding: 18px 0;
	}
	.floor {
		position: relative;
		display: flex;
		align-items: center;
		gap: 9px;
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 10px;
		text-align: left;
		cursor: default;
		transition:
			background 0.35s,
			border-color 0.35s,
			transform 0.35s;
	}
	.floor.tap {
		cursor: pointer;
	}
	.floor.tap:hover {
		border-color: var(--color-brand);
	}
	.dot {
		flex: none;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.35s;
	}
	.txt {
		display: flex;
		min-width: 0;
		flex-direction: column;
		line-height: 1.25;
	}
	.txt b {
		font-size: 13px;
		color: var(--color-ink);
	}
	/* the result wraps onto a second line instead of being cut off next to the badge */
	.txt small {
		line-height: 1.3;
		font-size: 11px;
		color: var(--color-muted);
	}
	.floor.ok {
		border-color: color-mix(in srgb, var(--color-grass) 55%, transparent);
		background: var(--color-grass-soft);
	}
	.floor.ok .dot {
		background: var(--color-grass);
	}
	.floor.fail {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.floor.fail .dot {
		background: var(--color-danger);
	}
	.floor.victim {
		border-color: color-mix(in srgb, var(--color-danger) 35%, transparent);
		background: color-mix(in srgb, var(--color-danger-soft) 55%, var(--color-card));
	}
	.floor.victim .dot {
		background: color-mix(in srgb, var(--color-danger) 45%, transparent);
	}
	.floor.here {
		transform: translateX(6px);
		border-color: var(--color-brand);
	}
	.tag {
		margin-left: auto;
		flex: none;
		border-radius: 999px;
		background: var(--color-card);
		padding: 2px 8px;
		font-size: 10px;
		font-style: normal;
		font-weight: 800;
		color: var(--color-danger);
		opacity: 0.75;
	}
	.tag.cul {
		background: var(--color-danger);
		color: #fff;
		opacity: 1;
	}
	/* step one, the floors light up from the bottom one after another */
	.tower.sweep .floor {
		animation: glow 1.2s ease-in-out both;
		animation-delay: calc(var(--i) * 0.45s);
	}
	@keyframes glow {
		40% {
			border-color: var(--color-brand);
			background: var(--color-brand-soft);
		}
	}
	/* step two, red climbs up the tower from the cut cable */
	.tower.fall .floor,
	.tower.fall .dot {
		transition-delay: calc(var(--i) * 0.3s);
	}
	.mark {
		position: absolute;
		left: 10px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-brand);
	}
	.mark.top {
		top: 0;
	}
	.mark.bottom {
		bottom: 0;
	}
	.side {
		display: flex;
		width: 34%;
		max-width: 150px;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 18px;
	}
	.laptop {
		width: 100%;
	}
	.lid {
		border-radius: 9px 9px 3px 3px;
		background: var(--color-ink);
		padding: 5px;
	}
	.screen {
		height: 82px;
		overflow: hidden;
		border-radius: 4px;
		background: var(--color-card);
		padding: 5px;
	}
	.base {
		height: 7px;
		margin: 0 -9px;
		border-radius: 2px 2px 8px 8px;
		background: color-mix(in srgb, var(--color-ink) 75%, var(--color-faint));
	}
	.addr {
		border-radius: 999px;
		background: var(--color-paper);
		padding: 2px 7px;
		font-size: 8.5px;
		color: var(--color-muted);
	}
	.err {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding-top: 7px;
		text-align: center;
		font-size: 8.5px;
		line-height: 1.25;
		color: var(--color-muted);
	}
	.err svg {
		width: 18px;
		height: 18px;
	}
	.eo {
		fill: var(--color-danger-soft);
	}
	.ex {
		stroke: var(--color-danger);
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.page {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 8px 3px 0;
	}
	.page i {
		display: block;
		height: 6px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.page i.h {
		width: 60%;
		height: 9px;
		background: var(--color-grass);
		opacity: 0.6;
	}
	.page i.s {
		width: 75%;
	}
	.router {
		width: 100%;
	}
	.cable {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 3;
		stroke-linecap: round;
		transition: opacity 0.3s;
	}
	.cable.cut {
		opacity: 0.15;
	}
	.ant {
		stroke: var(--color-ink);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.rbody {
		fill: var(--color-ink);
	}
	.rled {
		fill: var(--color-grass);
	}
	.rled.off {
		fill: var(--color-amber);
	}
	.play {
		border-radius: 999px;
		background: var(--btn-primary);
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
	}
	.fix {
		max-width: 440px;
		border-radius: 14px;
		background: var(--color-grass-soft);
		padding: 10px 14px;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--color-ink);
	}
	@media (max-width: 767px) {
		.txt b {
			font-size: 12px;
		}
		.txt small {
			font-size: 10px;
		}
		.floor {
			padding: 5px 8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.floor,
		.dot,
		.cable {
			transition: none;
		}
		.tower.sweep .floor {
			animation: none;
		}
	}
</style>
