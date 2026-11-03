<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { OnCallText } from '$lib/chapters/devops/on-call/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as OnCallText);

	let act = $state(0);
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	// ---- Act 1, the phone buzzes ----
	let acked = $state(false);
	function ack() {
		if (acked) return;
		acked = true;
		onstate?.('ack');
	}

	// ---- Act 2, follow the runbook ----
	const STEP_TOKENS = ['dash', 'change', 'rollback', 'resolved'];
	let stepDone = $state(0);
	let rolling = $state(false);
	let panicked = $state(false);
	let errors = $state(38);
	const fixed = $derived(stepDone >= STEP_TOKENS.length);

	function doStep(i: number) {
		if (i !== stepDone || rolling) return;
		if (i === 2) {
			rolling = true;
			[30, 19, 8, 2, 0.3].forEach((v, k) => at(220 * (k + 1), () => (errors = v)));
			at(1200, () => {
				rolling = false;
				stepDone = 3;
				onstate?.('rollback');
			});
			return;
		}
		stepDone = i + 1;
		onstate?.(STEP_TOKENS[i]);
	}
	function panic() {
		if (rolling || errors < 1) return;
		panicked = true;
		onstate?.('panic');
		errors = 0;
		at(500, () => (errors = 38));
	}

	// ---- Act 3, the blameless post mortem ----
	// the good answer sits on a different side each time, so it is a real choice
	const GOOD_FIRST = [false, true, false];
	let answered = $state<boolean[]>([false, false, false]);
	let nope = $state(-1);
	let done = false;
	const pmDone = $derived(answered.every(Boolean));

	function answer(qi: number, good: boolean) {
		if (answered[qi]) return;
		if (!good) {
			nope = qi;
			onstate?.('blame');
			at(500, () => (nope = -1));
			return;
		}
		answered = answered.map((a, i) => (i === qi ? true : a));
		if (answered.every(Boolean)) {
			onstate?.('postmortem');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		}
	}

	const note = $derived.by(() => {
		if (act === 0) return acked ? tx.noteAcked : tx.noteAlarm;
		if (act === 1) return fixed ? tx.noteFixed : tx.noteRunbook;
		return pmDone ? tx.notePmDone : tx.notePm;
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="tabs" role="tablist">
		{#each tx.acts as a, i (i)}
			<button
				type="button"
				role="tab"
				aria-selected={act === i}
				class:on={act === i}
				disabled={(i === 1 && !acked) || (i === 2 && !fixed)}
				onclick={() => (act = i)}>{a}</button
			>
		{/each}
	</div>

	{#if act === 0}
		<div class="acts">
			{#if !acked}
				<button type="button" class="cta" onclick={ack}>{tx.ackBtn}</button>
			{:else}
				<button type="button" class="cta" onclick={() => (act = 1)}>{tx.runbookBtn}</button>
			{/if}
		</div>

		<!-- the on call phone in the middle of the night -->
		<div class="phone" class:buzz={!acked}>
			<span class="notch"></span>
			<span class="ptime">03.12</span>
			<div class="notif" class:calm={acked}>
				<div class="nhead">
					<span class="napp">{tx.pagerApp}</span>
					{#if acked}<span class="acked">{tx.ackedTag}</span>{/if}
				</div>
				<b>{tx.alertTitle}</b>
				<span>{tx.alertBody}</span>
			</div>
			<span class="pnote">{tx.onCallNote}</span>
			<span class="pnote faint">{tx.escalateNote}</span>
		</div>
	{:else if act === 1}
		<div class="acts">
			{#if fixed}
				<button type="button" class="cta" onclick={() => (act = 2)}>{tx.postBtn}</button>
			{:else}
				<button type="button" class="line" disabled={rolling || errors < 1} onclick={panic}
					>{tx.panicBtn}</button
				>
			{/if}
		</div>

		<div class="meter" class:ok={errors < 1}>
			<span class="big">{errors}%</span>
			<span class="mlabel">{tx.errorsLabel}</span>
			{#if rolling}<span class="rolling">{tx.rollingTag}</span>{/if}
		</div>
		{#if panicked && stepDone < 3}
			<p class="panic">{tx.panicResult}</p>
		{/if}

		<div class="book">
			<b class="btitle">{tx.runbookTitle}</b>
			{#each tx.steps as s, i (i)}
				<div class="step" class:done={i < stepDone} class:next={i === stepDone}>
					<button
						type="button"
						class="sbtn"
						disabled={i !== stepDone || rolling}
						onclick={() => doStep(i)}
					>
						<span class="num">{i < stepDone ? '✓' : i + 1}</span>
						<span>{s.label}</span>
					</button>
					{#if i < stepDone}<span class="sres">{s.result}</span>{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="doc">
			<b class="dtitle">{tx.pmTitle}</b>
			<span class="dlabel">{tx.timelineLabel}</span>
			<ul class="tl">
				{#each tx.timeline as row, i (i)}
					<li>{row}</li>
				{/each}
			</ul>
			{#each tx.questions as q, qi (qi)}
				<div class="q" class:nope={nope === qi}>
					<span class="qq">{q.q}</span>
					{#if answered[qi]}
						<span class="ans">{q.good}</span>
					{:else}
						<div class="opts">
							{#each GOOD_FIRST[qi] ? [true, false] : [false, true] as good (good)}
								<button type="button" class="opt" onclick={() => answer(qi, good)}
									>{good ? q.good : q.bad}</button
								>
							{/each}
						</div>
						{#if nope === qi}<span class="nopetag">{tx.nopeTag}</span>{/if}
					{/if}
				</div>
			{/each}
			{#if pmDone}<span class="pmdone">{tx.pmDoneTag}</span>{/if}
		</div>
	{/if}

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 11px;
	}
	.tabs {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.tabs button {
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.tabs button:disabled {
		opacity: 0.4;
	}
	.acts {
		display: flex;
		min-height: 38px;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta,
	.line {
		border-radius: 11px;
		padding: 9px 18px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.cta {
		background: var(--btn-primary);
		color: #fff;
	}
	.line {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	.line:disabled {
		opacity: 0.45;
	}

	/* the phone, a dark screen at three in the morning */
	.phone {
		display: flex;
		width: 210px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 28px;
		border: 6px solid #16212b;
		background: #1b2533;
		padding: 10px 10px 18px;
		box-shadow: 0 14px 30px rgba(22, 40, 60, 0.2);
	}
	.phone.buzz {
		animation: buzz 0.9s ease-in-out infinite;
	}
	@keyframes buzz {
		0%,
		60%,
		100% {
			transform: rotate(0);
		}
		70% {
			transform: rotate(-2deg);
		}
		80% {
			transform: rotate(2deg);
		}
		90% {
			transform: rotate(-1deg);
		}
	}
	.notch {
		width: 50px;
		height: 5px;
		border-radius: 999px;
		background: #2c3746;
	}
	.ptime {
		font-size: 30px;
		font-weight: 300;
		color: #e0dcd4;
		font-variant-numeric: tabular-nums;
	}
	.notif {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 2px;
		border-radius: 14px;
		background: #f6e3e0;
		padding: 8px 10px;
		color: #16212b;
		transition: background 0.3s ease;
	}
	.notif.calm {
		background: #e0dcd4;
	}
	.nhead {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.napp {
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: #b8392c;
	}
	.acked {
		border-radius: 999px;
		background: #3a9c64;
		padding: 1px 7px;
		font-size: 9px;
		font-weight: 800;
		color: #fff;
	}
	.notif b {
		font-size: 12px;
	}
	.notif span:last-child {
		font-size: 10.5px;
		color: #5e6b76;
	}
	.pnote {
		font-size: 10px;
		font-weight: 600;
		color: #c9d1d9;
		text-align: center;
	}
	.pnote.faint {
		color: #8a949d;
		font-weight: 500;
	}

	.meter {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
	}
	.big {
		font-size: 30px;
		font-weight: 800;
		color: var(--color-danger);
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}
	.meter.ok .big {
		color: var(--color-grass);
	}
	.mlabel {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.rolling {
		margin-top: 3px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 1px 9px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-amber);
	}
	.panic {
		max-width: 320px;
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-danger);
	}
	.book,
	.doc {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 11px 12px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.btitle,
	.dtitle {
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.step {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.sbtn {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		padding: 6px 9px;
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.step.next .sbtn {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.step.done .sbtn {
		border-color: color-mix(in srgb, var(--color-grass) 45%, var(--color-line));
		background: var(--color-card);
	}
	.sbtn:disabled {
		cursor: default;
	}
	.step:not(.done):not(.next) .sbtn {
		opacity: 0.5;
	}
	.num {
		display: flex;
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-line);
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.step.next .num {
		background: var(--color-brand);
		color: #fff;
	}
	.step.done .num {
		background: var(--color-grass);
		color: #fff;
	}
	.sres {
		padding-left: 35px;
		font-size: 10.5px;
		color: var(--color-muted);
		animation: pop 0.3s ease both;
	}

	.dlabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.tl {
		display: flex;
		flex-direction: column;
		gap: 1px;
		margin: 0 0 4px;
		padding: 0;
		list-style: none;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.q {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-top: 1px solid var(--color-line);
		padding-top: 7px;
	}
	.q.nope {
		animation: shake 0.4s ease;
	}
	.qq {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.ans {
		font-size: 11.5px;
		color: var(--color-grass);
		font-weight: 600;
		animation: pop 0.3s ease both;
	}
	.opts {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.opt {
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 6px 9px;
		text-align: left;
		font-size: 11.5px;
		color: var(--color-ink);
		transition: border-color 0.15s ease;
	}
	.opt:hover {
		border-color: var(--color-brand);
	}
	.nopetag {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-danger);
	}
	.pmdone {
		align-self: center;
		margin-top: 4px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 2px 11px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.note {
		min-height: 1.4em;
		max-width: 360px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	@keyframes pop {
		from {
			transform: translateY(-3px);
			opacity: 0;
		}
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.phone.buzz,
		.q.nope,
		.sres,
		.ans {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.note {
			font-size: 13.5px;
			max-width: 440px;
		}
	}
</style>
