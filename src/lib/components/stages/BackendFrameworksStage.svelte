<script lang="ts">
	// Guided "watch" stage. A code editor for the POST /orders endpoint fills up by itself with
	// chore blocks (routing, reading the form, checks, fake request guard, database, answer)
	// while a line counter climbs. Then a framework frame slides in, the chores fold into it as
	// small "ready" parts, and only your own shop logic is left. The frame cycles through
	// Laravel, Express, Django, and Spring on its beat. The only optional play, on the last beat,
	// is taking the framework away.
	import Guide from '$lib/components/Guide.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BackendFrameworksText, ChoreId } from '$lib/chapters/web/backend-frameworks/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BackendFrameworksText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const lastBeat = $derived(tx.intro.length - 1);
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(beat >= lastBeat && peek === null);

	let byHand = $state(false);
	function toggle() {
		byHand = !byHand;
		onstate?.(byHand ? 'byhand' : 'framework');
	}

	const clock = sceneClock(() => [step, byHand]);
	const CHORES: ChoreId[] = ['route', 'read', 'check', 'guard', 'db', 'reply'];

	const hand = $derived(step <= 2 || (live && byHand));
	const shown = $derived.by(() => {
		const appear = clock.reduced ? 3 : Math.min(3, Math.floor(clock.t / 800) + 1);
		if (step === 0) return 0;
		if (step === 1) return appear;
		if (step === 2) return 3 + appear;
		return CHORES.length;
	});
	const count = $derived(
		hand ? CHORES.slice(0, shown).reduce((s, c) => s + tx.chores[c].lines, 0) : tx.yourLines
	);
	const fwIndex = $derived(
		step === 4 && !clock.reduced ? Math.floor(clock.t / 1800) % tx.frameworks.length : 0
	);
	const fw = $derived(tx.frameworks[fwIndex]);
	/** The request tag slides into the empty editor on the first beat. */
	const tagIn = $derived(step !== 0 || clock.t > 500);

	const handY = (i: number) => 64 + i * 34;
	const fwY = (i: number) => 150 + i * 20;
</script>

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 360 300"
			class="mx-auto block w-full max-w-[420px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the editor window -->
			<rect x="30" y="14" width="300" height="276" rx="12" class="win" />
			<line x1="30" y1="44" x2="330" y2="44" class="bar" />
			<circle cx="46" cy="29" r="4" class="wd" />
			<circle cx="59" cy="29" r="4" class="wd" />
			<circle cx="72" cy="29" r="4" class="wd" />
			<text x="86" y="33" class="file">{tx.fileName}</text>
			<g class="counter" class:big={hand && count > 100}>
				<rect x="236" y="20" width="84" height="18" rx="9" class="cntBg" />
				<text x="278" y="33" text-anchor="middle" class="cnt">
					{tx.lines.replace('{n}', String(count))}
				</text>
			</g>

			<!-- the request that this endpoint answers -->
			{#if step === 0}
				<g class="move" style="transform:translateX({tagIn ? 0 : -120}px);opacity:{tagIn ? 1 : 0}">
					<rect x="122" y="130" width="116" height="28" rx="14" class="req" />
					<text x="180" y="149" text-anchor="middle" class="reqT">{tx.requestTag}</text>
				</g>
				<text x="180" y="186" text-anchor="middle" class="hint">{tx.emptyHint}</text>
			{/if}

			<!-- the framework frame -->
			<g class="move" style="opacity:{hand ? 0 : 1};transform:translateY({hand ? 20 : 0}px)">
				<rect x="44" y="126" width="272" height="150" rx="10" class="frame" />
				<rect
					x="56"
					y="116"
					width={fw.name.length * 7.6 + fw.lang.length * 6 + 34}
					height="22"
					rx="11"
					class="fTag"
				/>
				{#key fwIndex}
					<text x="68" y="131" class="fTagT swap">
						{fw.name} <tspan class="fLang">({fw.lang})</tspan>
					</text>
				{/key}
			</g>

			<!-- your own code, what is left -->
			<g class="move" style="opacity:{hand ? 0 : 1};transform:translateY({hand ? -10 : 0}px)">
				<rect x="56" y="60" width="248" height="42" rx="8" class="mine" />
				<text x="70" y="86" class="mineT">{tx.yourCode}</text>
				<text x="292" y="86" text-anchor="end" class="ln mineL">
					{tx.lines.replace('{n}', String(tx.yourLines))}
				</text>
			</g>

			<!-- the chores -->
			{#each CHORES as c, i (c)}
				{@const on = i < shown}
				<g
					class="move"
					style="transform:translateY({hand ? handY(i) + (on ? 0 : -12) : fwY(i)}px);opacity:{on
						? 1
						: 0};transition-delay:{hand ? 0 : i * 70}ms"
				>
					{#if hand}
						<rect x="56" y="0" width="248" height="28" rx="6" class="chore" />
						<text x="70" y="18" class="choreT">{tx.chores[c].label}</text>
						<text x="292" y="18" text-anchor="end" class="ln">
							{tx.lines.replace('{n}', String(tx.chores[c].lines))}
						</text>
					{:else}
						<rect x="56" y="0" width="248" height="16" rx="4" class="chip" />
						<text x="66" y="11.5" class="chipT">{tx.chores[c].label}</text>
						<path d="M266 8l3 3 6 -6" class="tick" />
						<text x="292" y="11.5" text-anchor="end" class="chipT ready">{tx.ready}</text>
					{/if}
				</g>
			{/each}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={byHand} onclick={toggle}>
					{byHand ? tx.frameworkBtn : tx.byHandBtn}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.move {
		transition:
			transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.5s;
	}
	.swap {
		animation: swapIn 0.45s ease-out;
	}
	@keyframes swapIn {
		from {
			opacity: 0;
		}
	}
	.win {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.bar {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.wd {
		fill: var(--color-line);
	}
	.file {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		fill: var(--color-muted);
	}
	.cntBg {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition: stroke 0.3s;
	}
	.cnt {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.counter.big .cntBg {
		stroke: var(--color-danger);
	}
	.counter.big .cnt {
		fill: var(--color-danger);
	}
	.req {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.reqT {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.hint {
		font-size: 11px;
		fill: var(--color-faint);
	}
	.frame {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.fTag {
		fill: var(--color-brand);
	}
	.fTagT {
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.fLang {
		font-weight: 500;
	}
	.mine {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2.5;
	}
	.mineT {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.chore {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.choreT {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.ln {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.mineL {
		fill: var(--color-grass);
	}
	.chip {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1;
		opacity: 0.9;
	}
	.chipT {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.chipT.ready {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	@media (prefers-reduced-motion: reduce) {
		.move,
		.cntBg {
			transition: none;
		}
		.swap {
			animation: none;
		}
	}
</style>
