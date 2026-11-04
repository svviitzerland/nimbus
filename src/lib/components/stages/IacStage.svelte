<script lang="ts">
	// A guided Infrastructure as Code lesson. At first a pointer clicks through the cloud console
	// and servers appear one at a time (and one comes out different). Then the window turns into a
	// Terraform file, the terminal runs `terraform apply`, and servers pop up from the text. The
	// count changes from 3 to 5, everything is lost and rebuilt. On the last beat the learner may
	// change the count with plus and minus and watch the cloud follow the file.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { IacText } from '$lib/chapters/devops/iac/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as IacText);

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

	// real Terraform, split into coloured pieces (line 6 is the count, drawn on its own)
	type Piece = [string, '' | 'kw' | 'str'];
	const CODE: Piece[][] = [
		[
			['provider', 'kw'],
			[' "aws" {', '']
		],
		[
			['  region = ', ''],
			['"ap-southeast-3"', 'str']
		],
		[['}', '']],
		[],
		[
			['resource', 'kw'],
			[' "aws_instance" "web" {', '']
		],
		[],
		[
			['  ami           = ', ''],
			['"ami-0c55b159cbfafe1f0"', 'str']
		],
		[
			['  instance_type = ', ''],
			['"t3.small"', 'str']
		],
		[['}', '']]
	];
	const COUNT_LINE = 5;
	const SLOTS = [0, 1, 2, 3, 4];

	let have = $state(0);
	let want = $state(3);
	let hot = $state(false);
	let lost = $state(false);
	let typed = $state(CODE.length);
	let term = $state<string[]>(['$']);
	let ptrX = $state(330);
	let ptrY = $state(50);
	let press = $state(false);
	let userRun = $state(0);
	let fromHave = 0;

	const planLine = (add: number, del: number) =>
		`Plan: ${add} to add, 0 to change, ${del} to destroy.`;
	const doneLine = (add: number, del: number) =>
		`Apply complete! Resources: ${add} added, 0 changed, ${del} destroyed.`;

	function applySteps(from: number, to: number): SeqStep[] {
		const add = Math.max(0, to - from);
		const del = Math.max(0, from - to);
		const out: SeqStep[] = [
			[1100, () => (term = ['$ terraform apply'])],
			[1000, () => (term = ['$ terraform apply', planLine(add, del)])]
		];
		const dir = to > from ? 1 : -1;
		for (let n = from; n !== to; n += dir) {
			const v = n + dir;
			out.push([550, () => (have = v)]);
		}
		out.push([4200, () => (term = [planLine(add, del), doneLine(add, del)])]);
		return out;
	}

	function settle(s: number) {
		press = false;
		lost = false;
		hot = false;
		typed = CODE.length;
		ptrX = 330;
		ptrY = 50;
		if (s === 0) {
			have = 3;
			ptrX = 145;
			ptrY = 133;
			term = ['$'];
		} else if (s === 1) {
			have = 3;
			term = ['$'];
		} else if (s === 2) {
			have = 0;
			want = 3;
			term = ['$'];
		} else if (s === 3) {
			have = 3;
			want = 3;
			term = [planLine(3, 0), doneLine(3, 0)];
		} else if (s === 4) {
			have = 5;
			want = 5;
			hot = true;
			term = [planLine(2, 0), doneLine(2, 0)];
		} else {
			have = 5;
			want = 5;
			term = [planLine(5, 0), doneLine(5, 0)];
		}
	}

	function play(s: number, still: boolean, run: number): (() => void) | undefined {
		if (s === last && run > 0) {
			const from = fromHave;
			const to = want;
			if (still) {
				have = to;
				const add = Math.max(0, to - from);
				const del = Math.max(0, from - to);
				term = [planLine(add, del), doneLine(add, del)];
				return;
			}
			return runSeq(applySteps(from, to));
		}
		settle(s);
		if (still || s === 1 || s >= 6) return;
		if (s === 0) {
			const seq: SeqStep[] = [
				[
					700,
					() => {
						have = 0;
						ptrX = 330;
						ptrY = 50;
					}
				]
			];
			for (let k = 0; k < 3; k++) {
				seq.push(
					[900, () => ((ptrX = 200), (ptrY = 74))],
					[900, () => ((ptrX = 200), (ptrY = 102))],
					[800, () => ((ptrX = 145), (ptrY = 133))],
					[260, () => (press = true)],
					[
						700,
						() => {
							press = false;
							have = k + 1;
						}
					]
				);
			}
			seq.push([2600, () => ((ptrX = 330), (ptrY = 50))]);
			return runSeq(seq, true);
		}
		if (s === 2) {
			typed = 0;
			const seq: SeqStep[] = CODE.map((_, k) => [380, () => (typed = k + 1)] as SeqStep);
			return runSeq(seq);
		}
		if (s === 3)
			return runSeq(
				[
					[
						900,
						() => {
							have = 0;
							term = ['$'];
						}
					],
					...applySteps(0, 3)
				],
				true
			);
		if (s === 4)
			return runSeq(
				[
					[
						1600,
						() => {
							have = 3;
							want = 3;
							hot = false;
							term = [planLine(3, 0), doneLine(3, 0)];
						}
					],
					[
						900,
						() => {
							want = 5;
							hot = true;
						}
					],
					...applySteps(3, 5)
				],
				true
			);
		return runSeq(
			[
				[
					1500,
					() => {
						have = 5;
						lost = false;
						term = [planLine(5, 0), doneLine(5, 0)];
					}
				],
				[900, () => (lost = true)],
				[1400, () => (have = 0)],
				[200, () => (lost = false)],
				...applySteps(0, 5)
			],
			true
		);
	}

	$effect(() => {
		const s = step;
		const still = reduce;
		const run = userRun;
		return untrack(() => play(s, still, run));
	});

	function change(d: number) {
		const n = Math.max(1, Math.min(5, want + d));
		if (n === want) return;
		fromHave = have;
		want = n;
		hot = true;
		userRun += 1;
		onstate?.(d > 0 ? 'more' : 'less');
	}

	const consoleMode = $derived(step <= 1);
	const sizeOf = (k: number) => (step === 1 && k === 2 ? 't3.medium' : 't3.small');
	const termCls = (l: string) =>
		l.startsWith('$') ? 'prompt' : l.startsWith('Apply') ? 'done' : 'plan';
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="count" role="group" aria-label={tx.countLabel}>
				<span class="cap">{tx.countLabel}</span>
				<div class="stepper">
					<button
						type="button"
						aria-label={tx.lessBtn}
						disabled={want <= 1}
						onclick={() => change(-1)}
						><svg viewBox="0 0 12 12" class="ico"><path d="M2 6H10" /></svg></button
					>
					<span class="num">{want}</span>
					<button
						type="button"
						aria-label={tx.moreBtn}
						disabled={want >= 5}
						onclick={() => change(1)}
						><svg viewBox="0 0 12 12" class="ico"><path d="M2 6H10M6 2V10" /></svg></button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 312" class="scene" role="img" aria-label={tx.cloudLabel}>
			<!-- the window, a console form or a Terraform file -->
			<rect x="20" y="8" width="420" height="152" rx="10" class="win" />
			<path d="M20 30V18a10 10 0 0 1 10 -10H430a10 10 0 0 1 10 10V30Z" class="bar" />
			{#each [34, 46, 58] as x (x)}
				<circle cx={x} cy="19" r="3.5" class="dot" />
			{/each}
			<text x="74" y="23" class="tab">{consoleMode ? tx.consoleTitle : 'main.tf'}</text>

			{#if consoleMode}
				<g class="form" class:lit={i === 0}>
					<text x="40" y="78" class="f-label">{tx.sizeLabel}</text>
					<rect x="110" y="64" width="150" height="20" rx="5" class="field" />
					<text x="118" y="78" class="f-val" class:odd={i === 1}>
						{i === 1 ? 't3.medium' : 't3.small'}
					</text>
					<text x="40" y="106" class="f-label">{tx.regionLabel}</text>
					<rect x="110" y="92" width="150" height="20" rx="5" class="field" />
					<text x="118" y="106" class="f-val">{tx.regionValue}</text>
					<rect x="110" y="122" width="70" height="22" rx="6" class="btn" class:press />
					<text x="145" y="137" text-anchor="middle" class="btn-t">{tx.createBtn}</text>
				</g>
				{#if i === 0}
					<g class="ptr" class:snap={reduce} style="transform: translate({ptrX}px, {ptrY}px)">
						<path d="M0 0L0 15L4 11.5L7 18L9.5 17L6.6 10.6L11.5 10.6Z" />
					</g>
				{/if}
			{:else}
				<g class="code">
					{#each CODE as line, n (n)}
						{#if n < typed}
							{#if n === COUNT_LINE}
								<rect
									x="34"
									y={41 + n * 12.6}
									width="168"
									height="13"
									rx="3"
									class="hl"
									class:on={hot || i === 2}
								/>
								<text x="40" y={51 + n * 12.6} class="mono">
									<tspan>{'  count         = '}</tspan><tspan class="num-t">{want}</tspan>
								</text>
							{:else}
								<text x="40" y={51 + n * 12.6} class="mono">
									{#each line as [t, c], m (m)}<tspan class={c}>{t}</tspan>{/each}
								</text>
							{/if}
						{/if}
					{/each}
				</g>
			{/if}

			<!-- the terminal -->
			<rect x="20" y="168" width="420" height="42" rx="8" class="term" />
			{#each term.slice(-2) as l, n (n + l)}
				<text x="32" y={185 + n * 15} class="mono t {termCls(l)}">{l}</text>
			{/each}

			<!-- the cloud with its servers -->
			<text x="30" y="232" class="cloud-cap">{tx.cloudLabel}</text>
			{#if have === 0}
				<text x="230" y="276" text-anchor="middle" class="empty">{tx.emptyLabel}</text>
			{/if}
			{#each SLOTS as k (k)}
				{@const x = 30 + k * 84}
				<g
					class="rack"
					class:off={k >= have}
					class:lost
					class:odd={i === 1 && k === 2}
					class:still={reduce}
				>
					<rect {x} y="240" width="64" height="54" rx="7" class="shell" />
					{#each [248, 270] as y (y)}
						<rect x={x + 6} {y} width="52" height="17" rx="3" class="unit" />
						<circle cx={x + 14} cy={y + 8.5} r="2.8" class="led" />
						<line x1={x + 22} y1={y + 8.5} x2={x + 50} y2={y + 8.5} class="vent" />
					{/each}
					<text x={x + 32} y="307" text-anchor="middle" class="size">{sizeOf(k)}</text>
				</g>
			{/each}
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
	.count {
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
	.stepper {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.stepper button {
		height: 34px;
		width: 34px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		font-size: 18px;
		font-weight: 700;
		color: var(--color-brand);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.stepper button:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.ico {
		height: 12px;
		width: 12px;
		margin: auto;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.stepper button:disabled {
		opacity: 0.4;
	}
	.num {
		min-width: 24px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 18px;
		font-weight: 800;
		color: var(--color-ink);
	}

	.win {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		fill: var(--color-paper);
	}
	.dot {
		fill: var(--color-line);
	}
	.tab {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.f-label {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.field {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.f-val {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		fill: var(--color-ink);
	}
	.f-val.odd {
		fill: var(--color-amber);
		font-weight: 700;
	}
	.btn {
		fill: var(--color-brand);
		transition: opacity 0.15s;
	}
	.btn.press {
		opacity: 0.6;
	}
	.btn-t {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-card);
	}
	.ptr {
		transition: transform 0.75s cubic-bezier(0.45, 0, 0.3, 1);
	}
	.ptr.snap {
		transition: none;
	}
	.ptr path {
		fill: var(--color-ink);
		stroke: var(--color-card);
		stroke-width: 1.2;
	}

	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		white-space: pre;
		fill: var(--color-ink);
	}
	.mono .kw {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.mono .str {
		fill: var(--color-grass);
	}
	.num-t {
		fill: var(--color-amber);
		font-weight: 800;
	}
	.hl {
		fill: var(--color-amber-soft);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.hl.on {
		opacity: 1;
	}

	.term {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.t {
		font-size: 9.6px;
	}
	.t.prompt {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.t.plan {
		fill: var(--color-ink);
	}
	.t.done {
		fill: var(--color-grass);
		font-weight: 700;
	}

	.cloud-cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.empty {
		font-size: 11px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.rack {
		transform-box: fill-box;
		transform-origin: center bottom;
		transition:
			opacity 0.45s ease,
			transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.rack.off {
		opacity: 0;
		transform: scale(0.7);
	}
	.rack.still {
		transition: none;
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.rack.odd .shell {
		stroke: var(--color-amber);
	}
	.rack.lost .shell {
		stroke: var(--color-danger);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.rack.lost .led {
		fill: var(--color-danger);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.size {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		fill: var(--color-muted);
	}
	.rack.odd .size {
		fill: var(--color-amber);
		font-weight: 700;
	}

	@media (prefers-reduced-motion: reduce) {
		.stepper button,
		.btn,
		.ptr,
		.hl,
		.rack,
		.shell {
			transition: none;
		}
	}
</style>
