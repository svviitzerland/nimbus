<!--
	The RouterOS terminal shared by the MikroTik Lab stages, the same look as router-intro.
	It renders a RosShell (history, prompt, input) and only takes input while `live`.
-->
<script lang="ts">
	import type { RosShell } from './shell.svelte';

	let {
		shell,
		live,
		inputLabel,
		short = false
	}: { shell: RosShell; live: boolean; inputLabel: string; short?: boolean } = $props();

	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);

	function submit(e: Event) {
		e.preventDefault();
		if (!live || shell.typing) return;
		const v = shell.input;
		shell.input = '';
		shell.run(v);
	}
	$effect(() => {
		shell.seed();
	});
	$effect(() => {
		void shell.history.length;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="term" onclick={() => inputEl?.focus()}>
	<div class="tbar">
		<span class="dots"><i></i><i></i><i></i></span>
		<span class="thost">RouterOS, {shell.identity}</span>
	</div>
	<div class="tbody" class:short bind:this={bodyEl}>
		{#each shell.history as l, i (i)}
			<div class="ln {l.tone}">
				{#if l.tone === 'cmd'}<span class="pr">{l.prompt}</span>{/if}{l.text}
			</div>
		{/each}
		<form class="ln cmd active" onsubmit={submit}>
			<span class="pr" class:ask={!!shell.wizard}>{shell.prompt}</span>
			<input
				class="tin"
				bind:this={inputEl}
				bind:value={shell.input}
				readonly={shell.typing}
				disabled={!live}
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
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.28);
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
		gap: 3px;
		height: 178px;
		overflow: auto;
		padding: 11px 12px;
		font-size: 11.5px;
		line-height: 1.5;
	}
	.tbody.short {
		height: 132px;
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
	.pr.ask {
		color: #e0b65b;
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
		.tbody {
			font-size: 13px;
			height: 200px;
		}
		.tbody.short {
			height: 150px;
		}
	}
</style>
