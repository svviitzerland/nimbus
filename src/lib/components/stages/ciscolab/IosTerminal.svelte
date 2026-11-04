<!--
	The Cisco IOS console shared by the Cisco Lab stages. It renders an IosShell (history, the
	mode prompt, input), takes input only while `live`, and supports the arrow keys to recall
	commands and Tab to complete a word, like a real console. Password prompts hide what you type.
-->
<script lang="ts">
	import type { IosShell } from './shell.svelte';

	let {
		shell,
		live,
		inputLabel,
		height = 190
	}: { shell: IosShell; live: boolean; inputLabel: string; height?: number } = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let recall = -1;

	function submit(e: Event) {
		e.preventDefault();
		if (!live || shell.typing) return;
		const v = shell.input;
		shell.input = '';
		recall = -1;
		shell.run(v);
	}
	function key(e: KeyboardEvent) {
		if (!live || shell.typing) return;
		if (e.key === 'Tab') {
			e.preventDefault();
			shell.complete();
		} else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !shell.asking) {
			const past = shell.past;
			if (!past.length) return;
			e.preventDefault();
			if (e.key === 'ArrowUp') recall = recall < 0 ? past.length - 1 : Math.max(0, recall - 1);
			else recall = recall < 0 ? -1 : recall + 1 >= past.length ? -1 : recall + 1;
			shell.input = recall < 0 ? '' : past[recall];
		}
	}
	$effect(() => {
		shell.seed();
	});
	$effect(() => {
		void shell.history.length;
		void shell.input;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="term" class:live onclick={() => live && inputEl?.focus()}>
	<div class="tbar">
		<span class="dots"><i></i><i></i><i></i></span>
		<span class="thost">{shell.cfg.hostname} con0</span>
		<span class="mode">{shell.dev === 'router' ? 'Cisco IOS' : 'Catalyst IOS'}</span>
	</div>
	<div class="tbody" style="height:{height}px" bind:this={bodyEl}>
		{#each shell.history as l, i (i)}
			<div class="ln {l.tone}">
				{#if l.tone === 'cmd'}<span class="pr">{l.prompt}</span>{/if}{l.text}
			</div>
		{/each}
		<form class="ln cmd active" onsubmit={submit}>
			<span class="pr" class:ask={!!shell.asking}>{shell.prompt}</span>
			<input
				class="tin"
				type={shell.asking?.mask ? 'password' : 'text'}
				bind:this={inputEl}
				bind:value={shell.input}
				onkeydown={key}
				readonly={shell.typing}
				disabled={!live && !shell.typing}
				spellcheck="false"
				autocapitalize="off"
				autocomplete="off"
				aria-label={inputLabel}
			/>
		</form>
	</div>
</div>

<style>
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0e1b26;
		border: 1px solid #1c3243;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.24);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
	}
	.term.live {
		cursor: text;
		border-color: #2c5878;
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 12px;
		background: #142838;
		border-bottom: 1px solid #1c3243;
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
	.mode {
		margin-left: auto;
		font-size: 10px;
		font-weight: 700;
		color: #5f7a8e;
		letter-spacing: 0.04em;
	}
	.tbody {
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow: auto;
		padding: 10px 12px;
		font-size: 11.5px;
		line-height: 1.5;
	}
	.ln {
		color: #d2e2ee;
		white-space: pre;
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
	.ln.log {
		color: #e0b65b;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.muted {
		color: #7f9bb0;
		font-style: italic;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.pr {
		color: #6fc2f0;
		font-weight: 600;
	}
	.pr.ask {
		color: #e0b65b;
		margin-right: 0.6ch;
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
	.tin:disabled {
		color: #eaf1f6;
		opacity: 1;
	}
	@media (min-width: 768px) {
		.tbody {
			font-size: 12.5px;
		}
	}
</style>
