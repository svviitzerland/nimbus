<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { LanguagesText, LangId, JobLang } from '$lib/chapters/basics/languages/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as LanguagesText);

	const LANGS: LangId[] = ['machine', 'c', 'python'];
	// The same job in each language. Machine code is the real x86 bytes for "put 2 in a register,
	// add 3, return", one byte per row. Printing the answer would take far more.
	const CODE: Record<LangId, string[]> = {
		machine: [
			'10111000',
			'00000010',
			'00000000',
			'00000000',
			'00000000',
			'10000011',
			'11000000',
			'00000011',
			'11000011'
		],
		c: [
			'#include <stdio.h>',
			'',
			'int main(void) {',
			'    printf("%d\\n", 2 + 3);',
			'    return 0;',
			'}'
		],
		python: ['print(2 + 3)']
	};
	// How easy it is for a person to read, and how close it sits to the machine (0 to 100).
	const METERS: Record<LangId, { human: number; machine: number }> = {
		machine: { human: 4, machine: 100 },
		c: { human: 52, machine: 82 },
		python: { human: 94, machine: 34 }
	};
	const JOB_LANGS: JobLang[] = ['python', 'js', 'c'];

	let picked = $state<LangId | null>(null);
	const seen = new SvelteSet<LangId>();
	let view = $state<'code' | 'jobs'>('code');

	function pick(l: LangId) {
		picked = l;
		if (!seen.has(l)) seen.add(l);
		onstate?.(l);
	}

	// ---- The matching game ----
	let job = $state(0);
	let wrong = $state<JobLang | null>(null);
	let right = $state(false);
	let finished = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function answer(l: JobLang) {
		if (right || finished) return;
		const j = tx.jobs[job];
		if (l !== j.answer) {
			wrong = l;
			onstate?.('wrong');
			return;
		}
		wrong = null;
		right = true;
		onstate?.(j.id);
		clearTimeout(timer);
		timer = setTimeout(() => {
			if (job < tx.jobs.length - 1) {
				job += 1;
				right = false;
			} else {
				finished = true;
				oncomplete?.();
			}
		}, 1400);
	}

	const lineCount = $derived(picked ? CODE[picked].length : 0);
	onDestroy(() => clearTimeout(timer));
</script>

<div class="wrap">
	{#if view === 'code'}
		<p class="task">{tx.taskLabel}</p>
		<div class="tabs" role="tablist">
			{#each LANGS as l (l)}
				<button
					type="button"
					role="tab"
					aria-selected={picked === l}
					class="tab"
					class:on={picked === l}
					onclick={() => pick(l)}
				>
					<b>{tx.langs[l].name}</b>
					<span>{tx.langs[l].sub}</span>
					{#if seen.has(l)}<i class="seen" aria-hidden="true"></i>{/if}
				</button>
			{/each}
		</div>

		<div class="editor" class:bin={picked === 'machine'}>
			<div class="bar">
				<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="fname">
					{picked === 'machine' ? 'add.bin' : picked === 'c' ? 'add.c' : picked ? 'add.py' : ''}
				</span>
				{#if picked}
					<span class="count">{tx.linesLabel.replace('{n}', String(lineCount))}</span>
				{/if}
			</div>
			{#if picked}
				{#key picked}
					<div class="code">
						{#each CODE[picked] as row, i (i)}
							<div class="row"><span class="ln">{i + 1}</span>{row}</div>
						{/each}
					</div>
				{/key}
			{:else}
				<p class="hint">{tx.pickHint}</p>
			{/if}
		</div>

		{#if picked}
			<div class="meters">
				<div class="meter">
					<span>{tx.humanMeter}</span>
					<span class="track"><i class="fill human" style="width:{METERS[picked].human}%"></i></span
					>
				</div>
				<div class="meter">
					<span>{tx.machineMeter}</span>
					<span class="track"
						><i class="fill mach" style="width:{METERS[picked].machine}%"></i></span
					>
				</div>
				<p class="lnote">{tx.langs[picked].note}</p>
			</div>
		{/if}

		{#if seen.size === LANGS.length}
			<button type="button" class="cta" onclick={() => (view = 'jobs')}>{tx.toJobs}</button>
		{/if}
	{:else}
		<button type="button" class="back" onclick={() => (view = 'code')}>{tx.backToCode}</button>
		<div class="progress" aria-hidden="true">
			{#each tx.jobs as j, i (j.id)}
				<i class:done={i < job || (i === job && right) || finished} class:cur={i === job}></i>
			{/each}
		</div>
		{#if finished}
			<p class="win" role="status">{tx.allDone}</p>
		{:else}
			<p class="cap">
				{tx.jobsLabel.replace('{n}', String(job + 1)).replace('{total}', String(tx.jobs.length))}
			</p>
			{#key job}
				<div class="job">{tx.jobs[job].text}</div>
			{/key}
			<div class="answers">
				{#each JOB_LANGS as l (l)}
					<button
						type="button"
						class="ans"
						class:no={wrong === l}
						class:yes={right && tx.jobs[job].answer === l}
						disabled={right}
						onclick={() => answer(l)}
					>
						{tx.jobLangs[l]}
						{#if wrong === l}<small>{tx.wrongTag}</small>{/if}
						{#if right && tx.jobs[job].answer === l}<small>{tx.rightTag}</small>{/if}
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 520px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.task {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tabs {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		width: 100%;
	}
	.tab {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.tab b {
		font-size: 13px;
	}
	.tab span {
		font-size: 10.5px;
		color: var(--color-faint);
		line-height: 1.2;
		text-align: center;
	}
	.tab:hover {
		border-color: var(--color-brand);
	}
	.tab.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.seen {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-grass);
	}

	.editor {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.fname {
		flex: 1;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.count {
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--color-paper);
		font-weight: 700;
		color: var(--color-ink);
	}
	.code {
		margin: 0;
		padding: 10px 12px;
		min-height: 120px;
		max-height: 220px;
		overflow: auto;
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-ink);
		animation: fadein 0.3s ease;
	}
	.row {
		white-space: pre;
		min-height: 1.5em;
	}
	.bin .code {
		color: var(--color-brand);
		letter-spacing: 0.08em;
	}
	.ln {
		display: inline-block;
		width: 22px;
		margin-right: 10px;
		text-align: right;
		color: var(--color-faint);
		letter-spacing: 0;
		user-select: none;
	}
	@keyframes fadein {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.hint {
		margin: 0;
		padding: 40px 12px;
		text-align: center;
		font-size: 12.5px;
		color: var(--color-faint);
		background: var(--color-paper);
	}

	.meters {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
	}
	.meter {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.track {
		height: 8px;
		border-radius: 999px;
		background: var(--color-line);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		transition: width 0.5s cubic-bezier(0.3, 0.8, 0.3, 1);
	}
	.fill.human {
		background: var(--color-grass);
	}
	.fill.mach {
		background: var(--color-brand);
	}
	.lnote {
		margin: 2px 0 0;
		text-align: center;
		font-size: 12px;
		color: var(--color-faint);
	}

	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
	}
	.cta:hover {
		filter: brightness(1.18);
	}
	.back {
		align-self: flex-start;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
		padding: 4px 8px;
		border-radius: 8px;
	}
	.back:hover {
		color: var(--color-ink);
		background: var(--color-card);
	}
	.progress {
		display: flex;
		gap: 6px;
	}
	.progress i {
		width: 28px;
		height: 5px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.3s ease;
	}
	.progress i.cur {
		background: var(--color-brand);
	}
	.progress i.done {
		background: var(--color-grass);
	}
	.cap {
		margin: 0;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.job {
		width: 100%;
		padding: 16px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		text-align: center;
		font-size: 15px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--color-ink);
		animation: fadein 0.3s ease;
	}
	.answers {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		width: 100%;
	}
	.ans {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 11px 6px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 13.5px;
		font-weight: 700;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.ans:enabled:hover {
		border-color: var(--color-brand);
	}
	.ans small {
		font-size: 10px;
		font-weight: 600;
	}
	.ans.no {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		animation: shake 0.35s ease;
	}
	.ans.no small {
		color: var(--color-amber);
	}
	.ans.yes {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	.win {
		margin: 8px 0 0;
		padding: 8px 16px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 13px;
		font-weight: 700;
	}

	@media (max-width: 420px) {
		.meter {
			grid-template-columns: 1fr;
			gap: 3px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.code,
		.job,
		.ans.no {
			animation: none;
		}
		.fill,
		.tab,
		.ans {
			transition: none;
		}
	}
</style>
