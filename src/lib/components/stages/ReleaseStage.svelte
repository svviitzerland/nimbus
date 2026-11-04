<script lang="ts">
	// A guided release lesson. Ten phones (the users) sit at the top, a load balancer in the
	// middle, and two server racks at the bottom (v1 on the left, the new v2 on the right). Following
	// Nim, v2 goes to everyone at once and every phone turns red, then a canary release sends v2 to
	// one phone only, catches the bug, sends that user back, and grows the fixed v2.1 step by step.
	// On the last beat the learner may release the buggy v2 either way and compare.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ReleaseText } from '$lib/chapters/devops/release/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ReleaseText);

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

	type Pick = 'bigbang' | 'canary';
	const PHONES = Array.from({ length: 10 }, (_, k) => k);
	const CANARY = 6;
	const ORDER = [6, 2, 8, 0, 4, 9, 1, 5, 3, 7];

	let onV2 = $state<boolean[]>(Array(10).fill(false));
	let err = $state<boolean[]>(Array(10).fill(false));
	let v2 = $state<'idle' | 'bad' | 'fixed'>('idle');
	let bird = $state(false);
	let pick = $state<Pick | null>(null);
	let pickRun = $state(0);

	const none = () => Array<boolean>(10).fill(false);
	const allOn = () => Array<boolean>(10).fill(true);
	const only = (k: number) => PHONES.map((j) => j === k);
	const slice = (n: number) => PHONES.map((j) => ORDER.slice(0, n).includes(j));

	function reset() {
		onV2 = none();
		err = none();
		v2 = 'idle';
		bird = false;
	}

	function bigbang(loop: boolean): SeqStep[] {
		const seq: SeqStep[] = [
			[1400, reset],
			[
				1100,
				() => {
					onV2 = allOn();
				}
			],
			[
				2600,
				() => {
					err = allOn();
					v2 = 'bad';
				}
			]
		];
		ORDER.forEach((k) =>
			seq.push([
				420,
				() => {
					onV2 = onV2.map((v, j) => (j === k ? false : v));
					err = err.map((v, j) => (j === k ? false : v));
				}
			])
		);
		seq.push([loop ? 1600 : 0, () => (v2 = 'idle')]);
		return seq;
	}
	function canary(): SeqStep[] {
		return [
			[1400, reset],
			[
				1700,
				() => {
					bird = true;
					onV2 = only(CANARY);
				}
			],
			[
				2400,
				() => {
					err = only(CANARY);
					v2 = 'bad';
				}
			],
			[
				1800,
				() => {
					onV2 = none();
					err = none();
				}
			],
			[0, () => (v2 = 'fixed')]
		];
	}

	function play(s: number, still: boolean, p: Pick | null): (() => void) | undefined {
		reset();
		if (s === last && p) {
			if (still) {
				if (p === 'canary') {
					bird = true;
					v2 = 'fixed';
				}
				return;
			}
			return runSeq(p === 'bigbang' ? bigbang(false) : canary());
		}
		if (s === 1) {
			if (still) {
				onV2 = allOn();
				err = allOn();
				v2 = 'bad';
				return;
			}
			return runSeq(bigbang(true), true);
		}
		if (s >= 2 && s <= 6) bird = true;
		if (s === 2) {
			onV2 = only(CANARY);
			return;
		}
		if (s === 3) {
			onV2 = only(CANARY);
			if (still) {
				err = only(CANARY);
				v2 = 'bad';
				return;
			}
			return runSeq(
				[
					[
						1600,
						() => {
							onV2 = only(CANARY);
							err = none();
							v2 = 'idle';
						}
					],
					[
						3200,
						() => {
							err = only(CANARY);
							v2 = 'bad';
						}
					]
				],
				true
			);
		}
		if (s === 4) {
			v2 = 'fixed';
			if (still) return;
			return runSeq(
				[
					[
						1600,
						() => {
							onV2 = only(CANARY);
							err = only(CANARY);
							v2 = 'bad';
						}
					],
					[
						1600,
						() => {
							onV2 = none();
							err = none();
						}
					],
					[3200, () => (v2 = 'fixed')]
				],
				true
			);
		}
		if (s === 5) {
			v2 = 'fixed';
			if (still) {
				onV2 = slice(5);
				return;
			}
			return runSeq(
				[1, 3, 5, 10].map((n) => [n === 10 ? 3600 : 2000, () => (onV2 = slice(n))] as SeqStep),
				true
			);
		}
		if (s === 6) {
			v2 = 'fixed';
			onV2 = only(CANARY);
			return;
		}
		if (s === 7) {
			v2 = 'fixed';
			onV2 = allOn();
		}
	}

	$effect(() => {
		const s = step;
		const still = reduce;
		const p = pick;
		void pickRun;
		return untrack(() => play(s, still, p));
	});

	function choose(p: Pick) {
		pick = p;
		pickRun += 1;
		onstate?.(p);
	}

	const px = (k: number) => 22 + k * 42;
	const hurt = $derived(err.filter(Boolean).length);
	const anyV2 = $derived(onV2.some(Boolean));
	const v2Name = $derived(v2 === 'fixed' ? 'v2.1' : 'v2');
</script>

{#snippet rack(x: number, name: string, cls: string, lit: boolean)}
	<g class="rack {cls}" class:lit>
		<text x={x + 50} y="194" text-anchor="middle" class="ver">{name}</text>
		<rect {x} y="200" width="100" height="74" rx="9" class="shell" />
		{#each [210, 232, 254] as y, n (y)}
			<rect x={x + 8} {y} width="84" height="16" rx="3" class="unit" />
			<circle
				cx={x + 18}
				cy={y + 8}
				r="3"
				class="led"
				class:blink={cls === 'bad' && !reduce}
				style="animation-delay:{n * 0.12}s"
			/>
			<line x1={x + 30} y1={y + 8} x2={x + 82} y2={y + 8} class="vent" />
		{/each}
	</g>
{/snippet}

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.pickLabel}>
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					<button
						type="button"
						class="chip"
						class:on={pick === 'bigbang'}
						onclick={() => choose('bigbang')}>{tx.bigbangBtn}</button
					>
					<button
						type="button"
						class="chip"
						class:on={pick === 'canary'}
						onclick={() => choose('canary')}>{tx.canaryBtn}</button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 316" class="scene" role="img" aria-label="{tx.usersLabel}, {tx.lbLabel}">
			<!-- wires, phone to load balancer, load balancer to each version -->
			{#each PHONES as k (k)}
				<line x1={px(k) + 13} y1="58" x2="230" y2="128" class="wire" class:v2={onV2[k]} />
			{/each}
			<line x1="210" y1="158" x2="120" y2="198" class="wire" class:v1on={onV2.some((v) => !v)} />
			<line x1="250" y1="158" x2="340" y2="198" class="wire" class:v2={anyV2} />

			<!-- the phones -->
			<g role="group" aria-label={tx.usersLabel}>
				{#each PHONES as k (k)}
					{@const x = px(k)}
					<g class="phone" class:v2={onV2[k]} class:err={err[k]} class:fixed={v2 === 'fixed'}>
						<rect {x} y="12" width="26" height="46" rx="5" class="body" />
						<rect x={x + 3} y="17" width="20" height="33" rx="2" class="screen" />
						{#if err[k]}
							<text x={x + 13} y="38" text-anchor="middle" class="mark">!</text>
						{:else}
							<path d="M{x + 8} 33.5l3.5 3.5l7 -7" class="check" />
						{/if}
					</g>
				{/each}
			</g>

			<!-- the load balancer -->
			<rect x="170" y="128" width="120" height="30" rx="8" class="lb" />
			<text x="230" y="147" text-anchor="middle" class="lb-t">{tx.lbLabel}</text>

			<!-- the two versions -->
			{@render rack(
				70,
				'v1',
				'old',
				onV2.some((v) => !v)
			)}
			{@render rack(290, v2Name, v2, anyV2)}

			<!-- the canary, perched on v2 -->
			{#if bird}
				<g class="bird" class:still={reduce}>
					<path d="M360 192l-9 3l8 2Z" class="tail" />
					<ellipse cx="370" cy="191" rx="10" ry="7" class="b" />
					<circle cx="380" cy="183" r="5.5" class="b" />
					<path d="M385 182l5 1.5l-5 1.5Z" class="beak" />
					<circle cx="381.5" cy="181.5" r="1.1" class="eye" />
				</g>
			{/if}

			<!-- how many users are hurting -->
			<text x="230" y="296" text-anchor="middle" class="count" class:bad={hurt > 0}>
				{hurt > 0 ? tx.errors.replace('{n}', String(hurt)) : tx.allOk}
			</text>
			{#if i === 6}
				<text x="230" y="313" text-anchor="middle" class="rule">{tx.rule}</text>
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

	.wire {
		stroke: var(--color-line);
		stroke-width: 1.6;
		transition: stroke 0.4s;
	}
	.wire.v1on {
		stroke: color-mix(in srgb, var(--color-grass) 55%, var(--color-line));
	}
	.wire.v2 {
		stroke: var(--color-amber);
		stroke-width: 2;
	}

	.body {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-opacity: 0.35;
		stroke-width: 1.4;
	}
	.screen {
		fill: var(--color-grass-soft);
		transition: fill 0.4s;
	}
	.check {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.phone.v2 .screen {
		fill: var(--color-amber-soft);
	}
	.phone.v2 .check {
		stroke: var(--color-amber);
	}
	.phone.v2.fixed .screen {
		fill: var(--color-brand-soft);
	}
	.phone.v2.fixed .check {
		stroke: var(--color-brand);
	}
	.phone.err .screen {
		fill: var(--color-danger-soft);
	}
	.phone.err .body {
		stroke: var(--color-danger);
		stroke-opacity: 1;
	}
	.mark {
		font-size: 17px;
		font-weight: 800;
		fill: var(--color-danger);
	}

	.lb {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.lb-t {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}

	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.4s,
			fill 0.4s;
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-faint);
		transition: fill 0.4s;
	}
	.rack.lit .led {
		fill: var(--color-grass);
	}
	.ver {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 14px;
		font-weight: 800;
		fill: var(--color-muted);
	}
	.rack.old.lit .shell {
		stroke: var(--color-grass);
	}
	.rack.idle.lit .shell {
		stroke: var(--color-amber);
	}
	.rack.fixed .ver {
		fill: var(--color-brand);
	}
	.rack.fixed.lit .shell {
		stroke: var(--color-brand);
	}
	.rack.bad .shell {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.rack.bad .led {
		fill: var(--color-danger);
	}
	.rack.bad .ver {
		fill: var(--color-danger);
	}
	.led.blink {
		animation: blink 0.5s ease-in-out infinite alternate;
	}
	@keyframes blink {
		to {
			opacity: 0.3;
		}
	}

	.bird {
		transform-box: fill-box;
		transform-origin: center bottom;
		animation: bob 2.4s ease-in-out infinite;
	}
	.bird.still {
		animation: none;
	}
	@keyframes bob {
		50% {
			transform: translateY(-2px) rotate(-4deg);
		}
	}
	.b,
	.tail {
		fill: var(--color-amber);
	}
	.beak {
		fill: var(--color-danger);
	}
	.eye {
		fill: var(--color-ink);
	}

	.count {
		font-size: 12.5px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.count.bad {
		fill: var(--color-danger);
	}
	.rule {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.wire,
		.screen,
		.shell,
		.led {
			transition: none;
		}
		.led.blink,
		.bird {
			animation: none;
		}
	}
</style>
