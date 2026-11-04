<script lang="ts">
	// A guided blockchain lesson. Four blocks appear and link up by their fingerprints, then an old
	// amount gets changed by itself and the chain snaps right after it. Later beats show the other
	// copies outvoting the edited one, and a miner hunting for a fingerprint that starts with
	// zeros. The only optional play is changing block 2 yourself on the last beat.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import NgLaptop from './netguide/NgLaptop.svelte';
	import { fingerprint } from './crypto/hash';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';
	import type { StageProps } from '$lib/chapters/types';
	import type { BlockchainText } from '$lib/chapters/security/blockchain/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BlockchainText);

	// Watch first, play optional, so the stage is visible from the start and Next never locks.
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let userEdited = $state(false);
	function toggle() {
		userEdited = !userEdited;
		onstate?.(userEdited ? 'broken' : 'restored');
	}

	// the honest chain, every block storing the fingerprint of the one before it
	const GENESIS = '00000000';
	const honest = $derived.by(() => {
		const out: string[] = [];
		let prev = GENESIS;
		for (const r of tx.records) {
			prev = fingerprint(`${prev}|${r}`);
			out.push(prev);
		}
		return out;
	});
	const storedPrev = (k: number) => (k === 0 ? GENESIS : honest[k - 1]);

	let shown = $state(4);
	let links = $state(3);
	let edited = $state(false);
	let marks = $state(0);
	let frame = $state(16);

	const isEdited = $derived(step === last ? userEdited : edited);
	const record = (k: number) => (k === 1 && isEdited ? tx.edited : tx.records[k]);
	const own = $derived(tx.records.map((_, k) => fingerprint(`${storedPrev(k)}|${record(k)}`)));
	const brokenAfter = (k: number) => k < 3 && own[k] !== storedPrev(k + 1);
	const redo = (k: number) => isEdited && k > 1;

	// the miner's search for block 4, a nonce that makes the fingerprint start with two zeros
	const target = $derived.by(() => {
		const base = `${storedPrev(3)}|${tx.records[3]}`;
		let n = 0;
		while (n < 5000 && !fingerprint(`${base}|${n}`).startsWith('00')) n++;
		return n;
	});
	const nonce = $derived(Math.round((target * frame) / 16));
	const nonceFp = $derived(fingerprint(`${storedPrev(3)}|${tx.records[3]}|${nonce}`));

	function play(s: number, still: boolean): (() => void) | undefined {
		shown = 4;
		links = 3;
		edited = s === 4 || s === 5;
		marks = 4;
		frame = 16;
		if (still) {
			if (s === 3) edited = true;
			return;
		}
		if (s === 0)
			return runSeq(
				[
					[700, () => (shown = 1)],
					[700, () => (shown = 2)],
					[700, () => (shown = 3)],
					[3400, () => (shown = 4)]
				],
				true
			);
		if (s === 2)
			return runSeq(
				[
					[900, () => (links = 0)],
					[900, () => (links = 1)],
					[900, () => (links = 2)],
					[2600, () => (links = 3)]
				],
				true
			);
		if (s === 3)
			return runSeq(
				[
					[2000, () => (edited = false)],
					[4200, () => (edited = true)]
				],
				true
			);
		if (s === 5)
			return runSeq(
				[
					[700, () => (marks = 0)],
					[600, () => (marks = 1)],
					[600, () => (marks = 2)],
					[600, () => (marks = 3)],
					[3200, () => (marks = 4)]
				],
				true
			);
		if (s === 6)
			return runSeq(
				Array.from({ length: 17 }, (_, f): SeqStep => [f === 16 ? 3200 : 240, () => (frame = f)]),
				true
			);
		return;
	}

	$effect(() => {
		const s = step;
		const st = reduce;
		return untrack(() => play(s, st));
	});

	const BX = (k: number) => 10 + k * 108;
	const BY = 22;
	const label = (k: number) =>
		(step === 7 ? tx.commitLabel : tx.blockLabel).replace('{n}', String(k + 1));
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<button type="button" class="chip" class:on={userEdited} onclick={toggle}>
				{userEdited ? tx.restoreBtn : tx.editBtn}
			</button>
		{/if}

		<svg viewBox="0 0 440 232" class="art" role="img" aria-label={tx.records.join(', ')}>
			{#each tx.records as _, k (k)}
				{@const x = BX(k)}
				{#if k < shown}
					<g in:fade={{ duration: reduce ? 0 : 300 }}>
						<!-- the link to the next block -->
						{#if k < 3 && k + 1 < shown}
							{@const lit = i !== 2 || k < links}
							{@const snapped = brokenAfter(k)}
							<g class="link" class:on={lit} class:bad={snapped}>
								<rect x={x + 88} y={BY + 44} width="16" height="10" rx="5" class:apart={snapped} />
								<rect x={x + 96} y={BY + 44} width="16" height="10" rx="5" class:apart2={snapped} />
							</g>
							{#if snapped}
								<!-- above the gap, so it never runs into the "redo" tags under the blocks -->
								<text x={x + 100} y={BY - 8} class="tag bad" in:fade={{ duration: 200 }}
									>{tx.brokenTag}</text
								>
							{/if}
						{/if}

						<rect {x} y={BY} width="92" height="88" rx="8" class="block" class:redo={redo(k)} />
						<path
							d="M{x} {BY + 8} a8 8 0 0 1 8 -8 H{x + 84} a8 8 0 0 1 8 8 V{BY + 18} H{x} Z"
							class="head"
						/>
						<text x={x + 8} y={BY + 13} class="h-text">{label(k)}</text>
						<text x={x + 8} y={BY + 34} class="rec" class:changed={k === 1 && isEdited}
							>{record(k)}</text
						>
						<line x1={x + 6} y1={BY + 42} x2={x + 86} y2={BY + 42} class="div" />
						<g class="row" class:lit={i === 2 && k > 0 && k <= links}>
							<text x={x + 8} y={BY + 60} class="r-lbl">{tx.prevLabel}</text>
							<text x={x + 84} y={BY + 60} class="r-val">{storedPrev(k).slice(0, 4)}</text>
						</g>
						<g class="row own" class:lit={i === 1}>
							<text x={x + 8} y={BY + 78} class="r-lbl">{tx.hashLabel}</text>
							<text x={x + 84} y={BY + 78} class="r-val" class:changed={k === 1 && isEdited}
								>{own[k].slice(0, 4)}</text
							>
						</g>
						{#if redo(k)}
							<text x={x + 46} y={BY + 108} class="tag warn" in:fade={{ duration: 200 }}
								>{tx.redoTag}</text
							>
						{/if}
					</g>
				{/if}
			{/each}

			{#if i === 4}
				<text x="220" y="212" class="rule" in:fade={{ duration: 250 }}>{tx.rule}</text>
			{/if}

			{#if i === 5}
				<g in:fade={{ duration: 250 }}>
					{#each [0, 1, 2, 3] as c (c)}
						{@const cx = 64 + c * 104}
						{@const mine = c === 0}
						<NgLaptop
							x={cx}
							y={186}
							label={mine ? tx.yourCopy : tx.computer.replace('{n}', String(c + 1))}
							tone={mine ? 'var(--color-danger)' : 'var(--color-grass)'}
							lit={c < marks}
						/>
						{#if c < marks}
							<text x={cx} y="160" class="mark" class:bad={mine} in:fade={{ duration: 150 }}
								>{mine ? '✗' : '✓'}</text
							>
						{/if}
					{/each}
				</g>
			{/if}

			{#if i === 6}
				<g in:fade={{ duration: 250 }}>
					<rect x={BX(3) - 4} y="140" width="100" height="56" rx="8" class="miner" />
					<text x={BX(3) + 6} y="160" class="r-lbl">{tx.nonceLabel}</text>
					<text x={BX(3) + 86} y="160" class="r-val">{nonce}</text>
					<text x={BX(3) + 46} y="184" class="m-fp" class:good={frame === 16}>{nonceFp}</text>
					<path d="M{BX(3) + 46} 134 V{BY + 94}" class="arrow" />
				</g>
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
	.art {
		width: 100%;
		max-width: 470px;
		height: auto;
		overflow: visible;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.block {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.8;
		transition: stroke 0.3s;
	}
	.block.redo {
		stroke: var(--color-amber);
	}
	.head {
		fill: var(--color-brand-soft);
	}
	.h-text {
		font-size: 10px;
		font-weight: 800;
		fill: var(--color-brand);
	}
	.rec {
		font-size: 8.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.rec.changed,
	.r-val.changed {
		fill: var(--color-danger);
	}
	.div {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.r-lbl {
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.r-val {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: end;
		transition: fill 0.3s;
	}
	.row.lit .r-val {
		fill: var(--color-amber);
	}
	.row.own.lit .r-val {
		fill: var(--color-brand);
	}
	.link rect {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2.4;
		transition:
			stroke 0.3s,
			transform 0.4s;
	}
	.link.on rect {
		stroke: var(--color-grass);
	}
	.link.bad rect {
		stroke: var(--color-danger);
	}
	.link rect.apart {
		transform: translate(-4px, 5px) rotate(-14deg);
		transform-box: fill-box;
		transform-origin: center;
	}
	.link rect.apart2 {
		transform: translate(4px, -5px) rotate(14deg);
		transform-box: fill-box;
		transform-origin: center;
	}
	.tag {
		font-size: 9.5px;
		font-weight: 800;
		text-anchor: middle;
	}
	.tag.bad {
		fill: var(--color-danger);
	}
	.tag.warn {
		fill: var(--color-amber);
	}
	.rule {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-grass);
		text-anchor: middle;
	}
	.mark {
		font-size: 16px;
		font-weight: 800;
		fill: var(--color-grass);
		text-anchor: middle;
	}
	.mark.bad {
		fill: var(--color-danger);
	}
	.miner {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.m-fp {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.m-fp.good {
		fill: var(--color-grass);
	}
	.arrow {
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
	}
	@media (prefers-reduced-motion: reduce) {
		.block,
		.r-val,
		.link rect {
			transition: none;
		}
	}
</style>
