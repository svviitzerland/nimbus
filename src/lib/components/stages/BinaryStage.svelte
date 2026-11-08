<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { BinaryText, SizeId } from '$lib/chapters/basics/binary/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BinaryText);

	const WORD = 'nimbus';
	const VALUES = [128, 64, 32, 16, 8, 4, 2, 1];
	/** Bytes each thing takes, language independent, so it lives here. */
	const BYTES: Record<SizeId, number> = {
		char: 1,
		chat: 100,
		photo: 3_000_000,
		song: 4_000_000,
		movie: 4_000_000_000
	};
	const MAX_BITS = Math.log10(BYTES.movie * 8);

	const bitsOf = (c: string) => VALUES.map((v) => (c.charCodeAt(0) & v ? 1 : 0));

	let act = $state(0);
	let on = $state<boolean[]>(Array(8).fill(false));
	let touched = $state(false);
	let solved = $state(false);
	/** How many letters of the word are shown in the byte rows. */
	let filled = $state(0);
	let filling = $state(false);
	const opened = new SvelteSet<SizeId>();
	let last = $state<SizeId | null>(null);
	let done = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];

	const target = WORD[0];
	const targetCode = target.charCodeAt(0);
	const sum = $derived(on.reduce((s, b, i) => s + (b ? VALUES[i] : 0), 0));
	const isLetter = $derived(sum >= 97 && sum <= 122);
	const fmt = (n: number) => n.toLocaleString(tx.locale);

	const hint = $derived(
		solved
			? tx.matched.replace('{c}', target)
			: !touched
				? tx.hintTap
				: sum > targetCode
					? tx.hintHigh
					: tx.hintLow
	);

	function flip(i: number) {
		if (solved) return;
		on[i] = !on[i];
		touched = true;
		if (sum === targetCode) {
			solved = true;
			filled = 1;
			onstate?.('letter');
		}
	}

	function fillRest() {
		if (filling || filled >= WORD.length) return;
		filling = true;
		for (let k = 1; k < WORD.length; k++) {
			timers.push(
				setTimeout(() => {
					filled = k + 1;
					if (k === WORD.length - 1) {
						filling = false;
						onstate?.('word');
					}
				}, k * 380)
			);
		}
	}

	function openSize(id: SizeId) {
		opened.add(id);
		last = id;
		onstate?.(id);
		if (!done && opened.has('photo') && opened.has('movie')) {
			done = true;
			oncomplete?.();
		}
	}

	const barWidth = (id: SizeId) => Math.max(6, (Math.log10(BYTES[id] * 8) / MAX_BITS) * 100);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- the two parts, in order -->
	<div class="steps">
		{#each tx.acts as name, i (i)}
			<span class="stp" class:cur={act === i} class:past={act > i}>{name}</span>
		{/each}
	</div>

	{#if act === 0}
		<!-- action first, so it sits clear of Nim's bubble -->
		{#if solved && filled < WORD.length}
			<button type="button" class="cta" onclick={fillRest} disabled={filling}>{tx.helpBtn}</button>
		{:else if filled >= WORD.length}
			<button type="button" class="cta" onclick={() => (act = 1)}>{tx.sizesBtn}</button>
		{/if}

		<div class="card">
			<p class="goal">{tx.goal.replace('{c}', target)}</p>

			<!-- one byte, eight switches -->
			<div class="byte" class:solved>
				{#each VALUES as v, i (v)}
					<button
						type="button"
						class="sw"
						class:on={on[i]}
						aria-pressed={on[i]}
						aria-label={String(v)}
						disabled={solved}
						onclick={() => flip(i)}
					>
						<span class="val">{v}</span>
						<span class="track"><span class="knob"></span></span>
						<span class="bit">{on[i] ? 1 : 0}</span>
					</button>
				{/each}
			</div>

			<div class="readout">
				<span class="sum">{tx.sumLabel.replace('{n}', String(sum))}</span>
				<span class="letter" class:ok={isLetter}>
					{#if isLetter}
						{tx.letterIs}
						<b>{String.fromCharCode(sum)}</b>
					{:else}
						{tx.noLetter}
					{/if}
				</span>
			</div>
			<p class="hint" class:good={solved}>{hint}</p>
		</div>

		{#if filled > 0}
			<div class="word">
				<span class="wlabel">{tx.wordLabel}</span>
				{#each WORD.slice(0, filled).split('') as c, k (k)}
					<div class="row">
						<b class="ch">{c}</b>
						<span class="bits">
							{#each bitsOf(c) as b, j (j)}<i class:one={b === 1}>{b}</i>{/each}
						</span>
					</div>
				{/each}
				{#if filled >= WORD.length}
					<span class="wnote"
						>{tx.wordNote
							.replace('{b}', String(WORD.length))
							.replace('{n}', String(WORD.length * 8))}</span
					>
				{/if}
			</div>
		{/if}
	{:else}
		<p class="prompt">{tx.sizePrompt}</p>
		<div class="sizes">
			{#each tx.sizes as s (s.id)}
				{@const seen = opened.has(s.id)}
				<button
					type="button"
					class="size"
					class:seen
					class:last={last === s.id}
					onclick={() => openSize(s.id)}
				>
					<span class="shead">
						<b>{s.name}</b>
						<span class="sval">{s.size}</span>
					</span>
					<span class="strack"><i style="width:{seen ? barWidth(s.id) : 0}%"></i></span>
					<span class="scount">{seen ? tx.switches.replace('{n}', fmt(BYTES[s.id] * 8)) : ' '}</span
					>
				</button>
			{/each}
		</div>
		<p class="units">{done ? tx.doneNote : tx.units}</p>
	{/if}
</div>

<style>
	.steps {
		display: flex;
		gap: 6px;
	}
	.stp {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 11px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.stp.cur {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.stp.past {
		color: var(--color-grass);
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 11px 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.5;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		width: min(92vw, 350px);
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 10px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
	}
	.goal {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.byte {
		display: flex;
		width: 100%;
		justify-content: center;
		gap: 4px;
	}
	.sw {
		display: flex;
		flex: 1;
		max-width: 38px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 9px;
		padding: 4px 0;
		transition: background 0.2s ease;
	}
	.sw:enabled:hover {
		background: var(--color-paper);
	}
	.val {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.sw.on .val {
		color: var(--color-brand);
	}
	/* a vertical rocker switch, knob up means on */
	.track {
		position: relative;
		width: 22px;
		height: 40px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.sw.on .track {
		background: var(--color-brand);
	}
	.knob {
		position: absolute;
		left: 3px;
		top: 21px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(22, 40, 60, 0.25);
		transition: top 0.2s ease;
	}
	.sw.on .knob {
		top: 3px;
	}
	.byte.solved .sw.on .track {
		background: var(--color-grass);
	}
	.bit {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.sw.on .bit {
		color: var(--color-ink);
	}

	.readout {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		line-height: 1.3;
	}
	.sum {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.letter {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 26px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.letter b {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 7px;
		background: var(--color-brand-soft);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		color: var(--color-brand);
	}
	.hint {
		min-height: 1.4em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.hint.good {
		color: var(--color-grass);
	}

	.word {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.wlabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		animation: pop 0.3s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.ch {
		width: 14px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		color: var(--color-ink);
	}
	.bits {
		display: flex;
		gap: 2px;
	}
	.bits i {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 15px;
		height: 15px;
		border-radius: 4px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-style: normal;
		font-weight: 700;
		color: var(--color-faint);
	}
	.bits i.one {
		background: var(--color-brand);
		border-color: var(--color-brand);
		color: #fff;
	}
	.wnote {
		margin-top: 2px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}

	.prompt {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.sizes {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: min(92vw, 350px);
	}
	.size {
		display: flex;
		flex-direction: column;
		gap: 5px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 11px;
		text-align: left;
		transition: border-color 0.2s ease;
	}
	.size:hover {
		border-color: var(--color-muted);
	}
	.size.last {
		border-color: var(--color-brand);
	}
	.shead {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.shead b {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.sval {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.size.seen .sval {
		color: var(--color-brand);
	}
	.strack {
		position: relative;
		height: 7px;
		border-radius: 999px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.strack i {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-brand);
		transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.scount {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.units {
		max-width: 330px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		text-align: center;
	}

	:global(.dark) .cta {
		color: var(--color-ink);
		box-shadow: none;
	}
	:global(.dark) .card {
		box-shadow: none;
	}
	:global(.dark) .knob {
		background: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.row {
			animation: none;
		}
		.knob,
		.strack i {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.card,
		.sizes {
			width: 420px;
		}
		.sw {
			max-width: 44px;
		}
		.track {
			width: 26px;
			height: 48px;
		}
		.knob {
			width: 20px;
			height: 20px;
			top: 25px;
		}
		.val {
			font-size: 11px;
		}
		.goal {
			font-size: 15px;
		}
		.sum {
			font-size: 13.5px;
		}
		.letter,
		.hint {
			font-size: 13px;
		}
		.shead b {
			font-size: 14px;
		}
		.prompt {
			font-size: 14px;
		}
		.units {
			font-size: 12.5px;
			max-width: 420px;
		}
		.cta {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
