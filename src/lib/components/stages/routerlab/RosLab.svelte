<!--
	The layout every MikroTik Lab stage uses. On the left the office drawing (the stage's `art`)
	above a RouterOS terminal, on the right the calm Guide panel. While Nim tells the story the
	terminal types each beat's commands by itself and the stage hears about every act through
	`onact`, so the drawing reacts. On the last beat the terminal is the learner's, with one
	suggested command they can type or tap.
-->
<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import { toLn, type Act, type Ln } from './lab';
	import type { LabStep } from './text';

	let {
		steps,
		beat,
		scripts,
		identity = 'nimbus',
		live,
		suggestion,
		inputLabel,
		tryLabel,
		termHint,
		onrun,
		onact,
		onreset,
		onshow,
		oncomplete,
		art,
		extra
	}: {
		steps: LabStep[];
		beat: number;
		/** One script per beat. */
		scripts: Act[][];
		identity?: string;
		/** The learner may type (usually the last beat). */
		live: boolean;
		/** The one short command offered on the learner's turn. */
		suggestion: string;
		inputLabel: string;
		tryLabel: string;
		termHint: string;
		/** Runs a command the learner typed and returns what the terminal prints. */
		onrun: (line: string) => Ln[];
		/** An act with a `key` just happened, `instant` when it was replayed without animation. */
		onact: (key: string, instant: boolean) => void;
		/** Put the drawing back to the very start before a beat is rebuilt. */
		onreset: () => void;
		onshow?: (v: boolean) => void;
		oncomplete?: () => void;
		art: Snippet;
		/** Optional extra piece under the drawing (bars, a phone). */
		extra?: Snippet;
	} = $props();

	let lines = $state<Ln[]>([]);
	let typing = $state<string | null>(null);
	let input = $state('');
	let busy = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	const prompt = () => `[admin@${identity}] >`;

	let timers: ReturnType<typeof setTimeout>[] = [];
	function stop() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
	const reduced = () =>
		typeof window !== 'undefined' &&
		(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

	/** Run one act at once (used for earlier beats and under reduced motion). */
	function instant(a: Act) {
		if (a.cmd) lines.push({ tone: 'cmd', text: a.cmd, prompt: prompt() });
		if (a.key) onact(a.key, true);
		for (const o of a.out ?? []) lines.push(toLn(o));
	}

	/** Type a command letter by letter, then call `done`. */
	function typeOut(cmd: string, done: () => void, start = 450) {
		typing = '';
		const per = cmd.length > 50 ? 28 : 45;
		[...cmd].forEach((_, n) => later(start + n * per, () => (typing = cmd.slice(0, n + 1))));
		later(start + cmd.length * per + 320, () => {
			typing = null;
			done();
		});
	}

	function animate(acts: Act[], i: number, end: () => void) {
		if (i >= acts.length) return end();
		const a = acts[i];
		const next = () => later(a.wait ?? (a.cmd ? 900 : 0), () => animate(acts, i + 1, end));
		const after = () => {
			if (a.key) onact(a.key, false);
			const out = a.out ?? [];
			out.forEach((o, k) => later(140 + k * 110, () => lines.push(toLn(o))));
			later(140 + out.length * 110, next);
		};
		if (!a.cmd) return after();
		typeOut(a.cmd, () => {
			lines.push({ tone: 'cmd', text: a.cmd!, prompt: prompt() });
			after();
		});
	}

	function play(b: number) {
		stop();
		typing = null;
		busy = false;
		input = '';
		lines = [];
		onreset();
		for (let k = 0; k < b; k++) (scripts[k] ?? []).forEach(instant);
		const acts = scripts[b] ?? [];
		const finish = () => {
			if (live) lines.push({ tone: 'muted', text: termHint });
		};
		if (reduced()) {
			acts.forEach(instant);
			finish();
			return;
		}
		busy = acts.some((a) => a.cmd);
		animate(acts, 0, () => {
			busy = false;
			finish();
		});
	}

	$effect(() => {
		const b = beat;
		untrack(() => play(b));
	});
	$effect(() => {
		void lines.length;
		void typing;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});
	onMount(() => {
		onshow?.(true);
		oncomplete?.();
		return stop;
	});

	function runLine(raw: string) {
		const line = raw.trim();
		if (!line) return;
		if (line === 'clear' || line === '/clear') {
			lines = [];
			return;
		}
		lines.push({ tone: 'cmd', text: line, prompt: prompt() });
		for (const l of onrun(line)) lines.push(l);
	}
	function submit(e: Event) {
		e.preventDefault();
		if (!live || busy) return;
		const v = input;
		input = '';
		runLine(v);
	}
	function suggest() {
		if (!live || busy) return;
		if (reduced()) return runLine(suggestion);
		busy = true;
		typeOut(
			suggestion,
			() => {
				busy = false;
				runLine(suggestion);
				inputEl?.focus();
			},
			100
		);
	}
</script>

{#snippet scene()}
	<div class="side">
		{@render art()}
		{@render extra?.()}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="term" onclick={() => inputEl?.focus()}>
			<div class="tbar">
				<span class="dots"><i></i><i></i><i></i></span>
				<span class="thost">RouterOS, {identity}</span>
			</div>
			<div class="tbody" bind:this={bodyEl}>
				{#each lines as l, i (i)}
					<div class="ln {l.tone}">
						{#if l.tone === 'cmd'}<span class="pr">{l.prompt}</span>{/if}{l.text}
					</div>
				{/each}
				{#if typing !== null}
					<div class="ln cmd">
						<span class="pr">{prompt()}</span>{typing}<span class="cur"></span>
					</div>
				{:else if live}
					<form class="ln cmd active" onsubmit={submit}>
						<span class="pr">{prompt()}</span>
						<input
							class="tin"
							bind:this={inputEl}
							bind:value={input}
							readonly={busy}
							spellcheck="false"
							autocapitalize="off"
							autocomplete="off"
							aria-label={inputLabel}
						/>
					</form>
				{:else}
					<div class="ln cmd"><span class="pr">{prompt()}</span></div>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class="lab">
	{#if live}
		<div class="try">
			<span>{tryLabel}</span>
			<button type="button" class="chip" disabled={busy} onclick={suggest}>{suggestion}</button>
		</div>
	{/if}
	<Guide {steps} active={beat} visual={scene} />
</div>

<style>
	.lab {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: 100%;
		max-height: 100%;
		overflow-y: auto;
		padding: 2px 2px 7rem;
	}
	.side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 100%;
		max-width: 440px;
	}
	.try {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.22);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
		cursor: text;
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 12px;
		background: #15293a;
		border-bottom: 1px solid #1d3547;
	}
	.dots {
		display: inline-flex;
		gap: 5px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.dots i:nth-child(1) {
		background: #e06a5b;
	}
	.dots i:nth-child(2) {
		background: #e0b65b;
	}
	.dots i:nth-child(3) {
		background: #5bbd84;
	}
	.thost {
		font-size: 11px;
		font-weight: 600;
		color: #8aa2b3;
	}
	.tbody {
		display: flex;
		flex-direction: column;
		gap: 2px;
		height: 168px;
		overflow: auto;
		padding: 10px 12px;
		font-size: 11px;
		line-height: 1.5;
	}
	.ln {
		color: #93a7b6;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.tbl {
		white-space: pre;
		word-break: normal;
		color: #d2e2ee;
	}
	.ln.out {
		color: #d2e2ee;
	}
	.ln.ok {
		color: #6fd39a;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.err {
		color: #ff9d92;
	}
	.ln.muted {
		color: #6b8496;
		font-style: italic;
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.cur {
		display: inline-block;
		width: 7px;
		height: 13px;
		margin-left: 1px;
		vertical-align: -2px;
		background: #6fd39a;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.active {
		display: flex;
		align-items: baseline;
	}
	.tin {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		caret-color: #6fd39a;
		padding: 0;
		box-shadow: none;
	}
	.tin:focus {
		box-shadow: none;
	}
	@media (min-width: 768px) {
		.lab {
			padding-bottom: 2rem;
		}
		.tbody {
			font-size: 11.5px;
			height: 188px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cur {
			animation: none;
		}
		.chip {
			transition: none;
		}
	}
</style>
