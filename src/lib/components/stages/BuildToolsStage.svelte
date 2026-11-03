<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { BuildToolsText, BuildStep } from '$lib/chapters/web/build-tools/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as BuildToolsText);

	type Kind = 'html' | 'css' | 'js';
	type File = { name: string; kb: number; kind: Kind };

	// The source of nimbus.com, sizes in KB as a human wrote them.
	const SRC: File[] = [
		{ name: 'index.html', kb: 6, kind: 'html' },
		{ name: 'style.css', kb: 14, kind: 'css' },
		{ name: 'header.css', kb: 6, kind: 'css' },
		{ name: 'cart.css', kb: 5, kind: 'css' },
		{ name: 'app.js', kb: 38, kind: 'js' },
		{ name: 'cart.js', kb: 22, kind: 'js' },
		{ name: 'search.js', kb: 16, kind: 'js' },
		{ name: 'utils.js', kb: 30, kind: 'js' },
		{ name: 'chart.js', kb: 58, kind: 'js' }
	];
	const SRC_KB = SRC.reduce((a, f) => a + f.kb, 0);
	// How much each kind keeps after minify, and what compression keeps of that.
	const MINIFY: Record<Kind, number> = { html: 0.8, css: 0.7, js: 0.55 };
	const COMPRESS = 0.3;
	// A slow phone, roughly a quarter second per trip plus 40 KB per second.
	const loadTime = (files: number, kb: number) => files * 0.25 + kb / 40;
	const STEPS: BuildStep[] = ['bundle', 'minify', 'compress'];

	let on = $state<Record<BuildStep, boolean>>({ bundle: false, minify: false, compress: false });
	let building = $state(false);
	let out = $state<File[] | null>(null);
	let peek = $state(false);
	let saidPeek = false;
	let finished = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function compile(cfg: Record<BuildStep, boolean>): File[] {
		let files = SRC.map((f) => ({ ...f }));
		if (cfg.bundle) {
			const sum = (k: Kind) => files.filter((f) => f.kind === k).reduce((a, f) => a + f.kb, 0);
			files = [
				{ name: 'index.html', kb: sum('html'), kind: 'html' },
				{ name: 'app.css', kb: sum('css'), kind: 'css' },
				{ name: 'app.js', kb: sum('js'), kind: 'js' }
			];
		}
		return files.map((f) => {
			let kb = f.kb;
			if (cfg.minify) kb *= MINIFY[f.kind];
			if (cfg.compress) kb *= COMPRESS;
			return { ...f, kb: Math.max(0.5, Math.round(kb * 10) / 10) };
		});
	}

	function build() {
		if (building) return;
		const cfg = { ...on };
		building = true;
		out = null;
		clearTimeout(timer);
		timer = setTimeout(() => {
			building = false;
			out = compile(cfg);
			const n = STEPS.filter((s) => cfg[s]).length;
			if (n === 0) onstate?.('none');
			else if (n === STEPS.length) {
				onstate?.('best');
				if (!finished) {
					finished = true;
					oncomplete?.();
				}
			} else onstate?.('partial');
		}, 1300);
	}

	function togglePeek() {
		peek = !peek;
		if (peek && !saidPeek) {
			saidPeek = true;
			onstate?.('peek');
		}
	}

	const outKb = $derived(out ? Math.round(out.reduce((a, f) => a + f.kb, 0) * 10) / 10 : 0);
	const fmtS = (s: number) => tx.loadValue.replace('{s}', s.toFixed(1));
	const barW = (kb: number) => `${Math.max(8, Math.min(100, (kb / 58) * 100))}%`;

	const BEFORE = `// add one item to the cart
function addToCart(product, quantity) {
  const cartItems = getCart();
  cartItems.push({ product, quantity });
  saveCart(cartItems);
}`;
	const AFTER = `function a(b,c){const d=e();d.push({b,c}),f(d)}`;

	onDestroy(() => clearTimeout(timer));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="steps">
		{#each STEPS as s (s)}
			<label class="step" class:on={on[s]}>
				<input type="checkbox" bind:checked={on[s]} disabled={building} />
				<span class="box" aria-hidden="true">
					{#if on[s]}
						<svg width="10" height="10" viewBox="0 0 12 12"
							><path
								d="m2.5 6.3 2.3 2.3 4.7-5"
								stroke="currentColor"
								stroke-width="2"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>
					{/if}
				</span>
				<span class="txt"><b>{tx.steps[s].label}</b><span>{tx.steps[s].sub}</span></span>
			</label>
		{/each}
	</div>

	<button type="button" class="buildbtn" disabled={building} onclick={build}>
		{building ? tx.building : tx.build}
	</button>

	<div class="panel">
		<div class="cap">
			<span>{tx.srcLabel}</span>
			<span class="meta">{SRC.length} {tx.filesLabel.toLowerCase()}, {SRC_KB} KB</span>
		</div>
		<div class="files" class:going={building}>
			{#each SRC as f, i (f.name)}
				<span class="file {f.kind}" style="--d:{i * 60}ms">
					<span class="fn">{f.name}</span>
					<span class="kb">{f.kb} KB</span>
				</span>
			{/each}
		</div>
	</div>

	<svg
		class="arrow"
		class:busy={building}
		width="18"
		height="18"
		viewBox="0 0 24 24"
		aria-hidden="true"
		><path
			d="M12 4v15m0 0-6-6m6 6 6-6"
			stroke="currentColor"
			stroke-width="2.2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/></svg
	>

	<div class="panel">
		<div class="cap"><span>{tx.outLabel}</span></div>
		{#if out}
			<div class="outs">
				{#each out as f (f.name)}
					<div class="orow">
						<span class="fn">{f.name}</span>
						<span class="bar"><i class={f.kind} style="width:{barW(f.kb)}"></i></span>
						<span class="kb">{f.kb} KB</span>
					</div>
				{/each}
			</div>
			<div class="stats">
				<span
					><b>{SRC.length}</b>{' '}→{' '}<b class="good">{out.length}</b><em>{tx.filesLabel}</em
					></span
				>
				<span
					><b>{SRC_KB}</b>{' '}→{' '}<b class="good">{outKb}</b><em>{tx.sizeLabel} (KB)</em></span
				>
				<span
					><b>{fmtS(loadTime(SRC.length, SRC_KB))}</b>{' '}→{' '}<b class="good"
						>{fmtS(loadTime(out.length, outKb))}</b
					><em>{tx.loadLabel}</em></span
				>
			</div>
		{:else}
			<p class="empty">{building ? tx.building : tx.outEmpty}</p>
		{/if}
	</div>

	<button type="button" class="peekbtn" class:on={peek} onclick={togglePeek}>{tx.peek}</button>
	{#if peek}
		<div class="peek">
			<span class="pl">{tx.before}</span>
			<pre>{BEFORE}</pre>
			<span class="pl">{tx.after}</span>
			<pre class="min">{AFTER}</pre>
		</div>
	{/if}
</div>

<style>
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		width: min(94vw, 420px);
	}
	.step {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 6px;
		padding: 8px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.step.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.step input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.step:has(input:focus-visible) {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}
	.box {
		flex: none;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		margin-top: 1px;
		border-radius: 5px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: #fff;
	}
	.on .box {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}
	.txt {
		display: flex;
		flex-direction: column;
		min-width: 0;
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.txt span {
		font-size: 10.5px;
		line-height: 1.25;
		color: var(--color-muted);
	}
	.buildbtn {
		border-radius: 12px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 10px 26px;
		font-size: 14px;
		font-weight: 700;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
	}
	.buildbtn:disabled {
		opacity: 0.6;
	}
	.panel {
		width: min(94vw, 420px);
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
	}
	.cap {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.meta {
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.files {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		padding: 8px;
	}
	.file {
		display: inline-flex;
		align-items: baseline;
		gap: 5px;
		padding: 3px 8px;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		font-size: 10.5px;
		transition:
			transform 0.5s ease var(--d),
			opacity 0.5s ease var(--d);
	}
	.files.going .file {
		transform: translateY(14px) scale(0.85);
		opacity: 0.35;
	}
	.fn {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
		color: var(--color-ink);
	}
	.file.html .fn {
		color: var(--color-danger);
	}
	.file.css .fn {
		color: var(--color-brand);
	}
	.file.js .fn {
		color: var(--color-amber);
	}
	.kb {
		font-size: 10px;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.arrow {
		color: var(--color-faint);
	}
	.arrow.busy {
		color: var(--color-brand);
		animation: bob 0.6s ease-in-out infinite alternate;
	}
	@keyframes bob {
		to {
			transform: translateY(3px);
		}
	}
	.outs {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px 10px;
	}
	.orow {
		display: grid;
		grid-template-columns: 82px 1fr 56px;
		align-items: center;
		gap: 8px;
		font-size: 10.5px;
		animation: in 0.35s ease;
	}
	.orow .kb {
		text-align: right;
	}
	.bar {
		height: 7px;
		border-radius: 4px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 4px;
	}
	.bar i.html {
		background: var(--color-danger);
	}
	.bar i.css {
		background: var(--color-brand);
	}
	.bar i.js {
		background: var(--color-amber);
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		padding: 8px 10px;
		border-top: 1px solid var(--color-line);
		background: var(--color-paper);
		font-size: 11px;
		color: var(--color-muted);
		text-align: center;
	}
	.stats span {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.stats em {
		font-style: normal;
		font-size: 10px;
		color: var(--color-faint);
	}
	.stats b {
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.stats b.good {
		color: var(--color-grass);
	}
	.empty {
		margin: 0;
		padding: 14px 10px;
		text-align: center;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.peekbtn {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		padding: 5px 12px;
		font-size: 11.5px;
		font-weight: 600;
	}
	.peekbtn.on {
		border-color: var(--color-ink);
		color: var(--color-ink);
	}
	.peek {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: min(94vw, 420px);
	}
	.pl {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	pre {
		margin: 0;
		padding: 8px 10px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		line-height: 1.5;
		color: var(--color-ink);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	pre.min {
		color: var(--color-grass);
	}
	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.file,
		.step {
			transition: none;
		}
		.files.going .file {
			transform: none;
		}
		.arrow.busy,
		.orow {
			animation: none;
		}
	}
</style>
