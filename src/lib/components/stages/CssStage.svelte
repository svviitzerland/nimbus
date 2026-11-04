<script lang="ts">
	// Guided CSS. Nim's beats write style.css line by line, and the sandboxed preview of the
	// nimbus.com page dresses up each time a line is finished. The only play is optional, on the
	// last beat a few swatches rewrite the final h1 rule.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CssText } from '$lib/chapters/web/css/types';
	import Guide from '../Guide.svelte';
	import TypedCode from './frontend/TypedCode.svelte';
	import PreviewPane from './frontend/PreviewPane.svelte';
	import { NIM_DATA, esc, pageDoc } from './frontend/code';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as CssText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	// The step in focus follows Nim, and a tap on a dot can peek at another one.
	let view = $state(0);
	$effect(() => {
		view = beat;
	});
	const last = $derived(tx.steps.length - 1);

	const SWATCHES = ['#2e6fe0', '#3a9c64', 'tomato', '#dd9e36'];
	let swatch = $state(SWATCHES[0]);
	let said = false;
	function pick(c: string) {
		swatch = c;
		if (!said) {
			said = true;
			onstate?.('color');
		}
	}

	function cssAt(v: number) {
		const out = [`/* ${tx.comment} */`];
		if (v >= 1) {
			out.push('body {');
			if (v >= 2) out.push('  background: #eaf3ff;');
			if (v >= 4) out.push('  font-family: system-ui, sans-serif;');
			out.push('}');
		}
		if (v >= 3) out.push('', 'h1 {', '  color: tomato;', '}');
		if (v >= 5)
			out.push(
				'',
				'button {',
				'  background: #2e6fe0;',
				'  color: white;',
				'  border: 0;',
				'  border-radius: 999px;',
				'  padding: 10px 20px;',
				'}'
			);
		if (v >= 6) out.push('', 'h1 {', `  color: ${v >= last ? swatch : SWATCHES[0]};`, '}');
		return out.join('\n') + '\n';
	}
	const code = $derived(cssAt(view));

	// The preview only changes once a line is fully typed, so it never flickers mid word.
	let settled = $state(untrack(() => code));
	const body = $derived(
		`<img src="${NIM_DATA}" alt="${esc(tx.page.alt)}">` +
			`<h1>${esc(tx.page.heading)}</h1>` +
			`<p>${esc(tx.page.paragraph)}</p>` +
			`<button>${esc(tx.page.button)}</button>`
	);
	const srcdoc = $derived(pageDoc({ css: 'img{display:block;height:56px}' + settled, body }));
</script>

<div class="h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full justify-center pb-28 md:pb-6">
		<Guide steps={tx.steps} active={view} onselect={(k) => (view = k)}>
			{#snippet visual()}
				<div class="flex w-full max-w-[460px] flex-col gap-3">
					<div style="--frame-h:190px;--frame-h-wide:200px">
						<PreviewPane label={tx.previewLabel} {srcdoc} led={view > 0} />
					</div>
					<TypedCode {code} lang="css" label={tx.cssLabel} onsettled={(c) => (settled = c)} />
					{#if view >= last}
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-xs font-semibold text-muted">{tx.tryLabel}</span>
							{#each SWATCHES as c (c)}
								<button
									type="button"
									class="sw"
									class:on={swatch === c}
									style="--c:{c}"
									aria-label={c}
									aria-pressed={swatch === c}
									onclick={() => pick(c)}
								></button>
							{/each}
						</div>
					{/if}
				</div>
			{/snippet}
		</Guide>
	</div>
</div>

<style>
	.sw {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--c);
		border: 2px solid var(--color-card);
		box-shadow: 0 0 0 1px var(--color-line);
		transition: box-shadow 0.2s;
	}
	.sw.on {
		box-shadow: 0 0 0 2px var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.sw {
			transition: none;
		}
	}
</style>
