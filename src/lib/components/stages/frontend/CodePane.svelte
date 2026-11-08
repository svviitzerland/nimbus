<script lang="ts">
	// A small code editor, a transparent textarea over highlighted text, shared by the frontend
	// lessons. Optional tabs let a stage show a second file (read only) next to the one you edit.
	import { tokenize, type CodeLang } from './code';

	let {
		value = $bindable(''),
		lang,
		label,
		readonly = false,
		resetLabel = '',
		onreset,
		hint = '',
		hintTone = 'amber',
		ta = $bindable(null),
		tabs = [],
		tab = $bindable(''),
		onfocus
	}: {
		value?: string;
		lang: CodeLang;
		label: string;
		readonly?: boolean;
		resetLabel?: string;
		onreset?: () => void;
		hint?: string;
		hintTone?: 'amber' | 'danger';
		ta?: HTMLTextAreaElement | null;
		tabs?: { id: string; label: string }[];
		tab?: string;
		onfocus?: () => void;
	} = $props();

	let hl = $state<HTMLPreElement | null>(null);
	const tokens = $derived(tokenize(value, lang));

	function syncScroll() {
		if (hl && ta) {
			hl.scrollTop = ta.scrollTop;
			hl.scrollLeft = ta.scrollLeft;
		}
	}
</script>

<div class="pane">
	<div class="bar">
		<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
		{#if tabs.length}
			<span class="tabs" role="tablist">
				{#each tabs as t (t.id)}
					<button
						type="button"
						role="tab"
						class="tab"
						class:on={tab === t.id}
						aria-selected={tab === t.id}
						onclick={() => (tab = t.id)}>{t.label}</button
					>
				{/each}
			</span>
		{:else}
			<span class="fname">{label}</span>
		{/if}
		{#if onreset && resetLabel && !readonly}
			<button type="button" class="reset" onclick={onreset}>{resetLabel}</button>
		{/if}
	</div>
	<div class="code">
		<pre class="hl" bind:this={hl} aria-hidden="true">{#each tokens as t, i (i)}<span class={t.k}
					>{t.v}</span
				>{/each}</pre>
		<textarea
			bind:this={ta}
			bind:value
			{readonly}
			onscroll={syncScroll}
			{onfocus}
			spellcheck="false"
			autocapitalize="off"
			autocomplete="off"
			aria-label={label}
		></textarea>
	</div>
	{#if hint}
		<p class="hint" class:bad={hintTone === 'danger'} role="status">{hint}</p>
	{/if}
</div>

<style>
	.pane {
		min-width: 0;
		display: flex;
		flex-direction: column;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
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
	.fname,
	.tabs {
		flex: 1;
		min-width: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.tabs {
		display: flex;
		gap: 4px;
	}
	.tab {
		font: inherit;
		padding: 2px 8px;
		border-radius: 6px;
		color: var(--color-faint);
	}
	.tab.on {
		color: var(--color-ink);
		background: var(--color-paper);
	}
	.reset {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		padding: 2px 6px;
		border-radius: 6px;
	}
	.reset:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}

	.code {
		position: relative;
		height: var(--code-h, 160px);
		background: var(--color-paper);
	}
	@media (min-width: 768px) {
		.code {
			height: var(--code-h-wide, 220px);
		}
	}
	.hl,
	textarea {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 10px 12px;
		border: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		line-height: 1.55;
		tab-size: 2;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		word-break: normal;
		overflow: auto;
	}
	.hl {
		pointer-events: none;
		color: var(--color-ink);
		scrollbar-width: none;
	}
	.hl::-webkit-scrollbar {
		display: none;
	}
	textarea {
		resize: none;
		background: transparent;
		color: transparent;
		caret-color: var(--color-ink);
		outline: none;
	}
	textarea::selection {
		background: rgba(46, 111, 224, 0.25);
	}
	.hl .pun {
		color: var(--color-faint);
	}
	.hl .tag,
	.hl .sel,
	.hl .kw {
		color: var(--color-brand);
		font-weight: 600;
	}
	.hl .att,
	.hl .prop,
	.hl .num {
		color: var(--color-amber);
	}
	.hl .str,
	.hl .val {
		color: var(--color-grass);
	}
	.hl .com {
		color: var(--color-faint);
		font-style: italic;
	}

	.hint {
		margin: 0;
		padding: 7px 11px;
		border-top: 1px solid var(--color-line);
		background: var(--color-amber-soft);
		color: var(--color-ink);
		font-size: 12px;
	}
	.hint.bad {
		background: var(--color-danger-soft);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
	}
</style>
