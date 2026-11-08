<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { ComponentsText } from '$lib/chapters/web/components/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ComponentsText);

	// Each product gets its own picture colour, the card itself never changes. The shop preview is a
	// real white page, so these stay as fixed colours in both themes.
	const TINTS = ['#2e6fe0', '#dd9e36', '#3a9c64', '#d3584a'];
	const SOFTS = ['#eaf1fc', '#fbf1de', '#e7f3ec', '#fbe9e6'];
	const money = (n: number) => tx.money.replace('{n}', String(n));

	// Cards on the page, in the order the learner placed them.
	let placed = $state<number[]>([]);
	const usedSet = new SvelteSet<number>();
	let upgraded = $state(false);
	const allPlaced = $derived(placed.length === tx.products.length);

	function use(i: number) {
		if (usedSet.has(i)) return;
		usedSet.add(i);
		placed = [...placed, i];
		if (placed.length === 1) onstate?.('first');
		else if (placed.length === tx.products.length) onstate?.('all');
	}
	let finished = false;
	function upgrade() {
		if (upgraded || !allPlaced) return;
		upgraded = true;
		onstate?.('upgrade');
		if (!finished) {
			finished = true;
			oncomplete?.();
		}
	}
</script>

{#snippet pic(i: number)}
	<svg width="100%" height="100%" viewBox="0 0 40 30" aria-hidden="true">
		<rect width="40" height="30" fill={SOFTS[i % 4]} />
		{#if i % 4 === 0}
			<path d="M14 8h10v11a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3Z" fill={TINTS[0]} />
			<path
				d="M24 10.5h1.4a2.4 2.4 0 0 1 0 4.8H24"
				stroke={TINTS[0]}
				stroke-width="1.8"
				fill="none"
			/>
		{:else if i % 4 === 1}
			<path d="M11 18a9 7 0 0 1 18 0Z" fill={TINTS[1]} />
			<rect x="10" y="18" width="22" height="3" rx="1.5" fill={TINTS[1]} />
		{:else if i % 4 === 2}
			<path
				d="M15 7l-6 4 2.5 4 2.5 -1.5V23h12v-9.5l2.5 1.5 2.5 -4 -6 -4c-1 2 -6 2 -8 0Z"
				fill={TINTS[2]}
			/>
		{:else}
			<circle cx="20" cy="15" r="7.5" fill={TINTS[3]} />
			<circle cx="20" cy="15" r="3" fill={SOFTS[3]} />
		{/if}
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="wrap">
		<!-- the data, one Card call per product -->
		<div class="panel">
			<div class="cap">{tx.dataLabel}</div>
			<ul class="rows">
				{#each tx.products as p, i (i)}
					<li class:used={usedSet.has(i)}>
						<code
							><span class="tag">&lt;Card</span> <span class="att">name</span>=<span class="str"
								>"{p.name}"</span
							> <span class="att">price</span>=<span class="str">{'{'}{p.price}&#125;</span>
							<span class="tag">/&gt;</span></code
						>
						<button type="button" class="use" disabled={usedSet.has(i)} onclick={() => use(i)}
							>{usedSet.has(i) ? tx.used : tx.use}</button
						>
					</li>
				{/each}
			</ul>
			<div class="up">
				<button
					type="button"
					class="upbtn"
					class:ready={allPlaced && !upgraded}
					disabled={!allPlaced || upgraded}
					onclick={upgrade}>{tx.upgrade}</button
				>
				{#if !allPlaced}<span class="uphint">{tx.upgradeHint}</span>{/if}
			</div>
		</div>

		<div class="pair">
			<!-- the recipe, written once -->
			<div class="panel recipe">
				<div class="cap mono">{tx.recipeLabel}</div>
				<pre><span class="pun">&lt;</span><span class="tag">div</span> <span class="att">class</span
					>=<span class="str">"card"</span><span class="pun">&gt;</span>
  <span class="pun">&lt;</span><span class="tag">img</span> <span class="att">src</span>=<span
						class="str">{'{'}photo&#125;</span
					> <span class="pun">/&gt;</span>
  <span class="pun">&lt;</span><span class="tag">h3</span><span class="pun">&gt;</span><span
						class="str">{'{'}name&#125;</span
					><span class="pun">&lt;/</span><span class="tag">h3</span><span class="pun">&gt;</span>
  <span class="pun">&lt;</span><span class="tag">p</span><span class="pun">&gt;</span><span
						class="str">{'{'}price&#125;</span
					><span class="pun">&lt;/</span><span class="tag">p</span><span class="pun">&gt;</span
					>{#if upgraded}
						<span class="added">  <span class="pun">&lt;</span><span class="tag">button</span><span
								class="pun">&gt;</span
							>{tx.addToCart}<span class="pun">&lt;/</span><span class="tag">button</span><span
								class="pun">&gt;</span
							></span
						>{/if}
<span class="pun">&lt;/</span><span class="tag">div</span><span class="pun">&gt;</span></pre>
			</div>

			<!-- the shop, built from the recipe plus the data -->
			<div class="panel shop">
				<div class="cap">
					<span class="led" class:on={placed.length > 0}></span>{tx.previewLabel}
				</div>
				<div class="grid">
					{#if placed.length === 0}
						<p class="empty">{tx.empty}</p>
					{/if}
					{#each placed as i (i)}
						<div class="card">
							<div class="ph">{@render pic(i)}</div>
							<b>{tx.products[i].name}</b>
							<span>{money(tx.products[i].price)}</span>
							{#if upgraded}
								<span class="cart">{tx.addToCart}</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: min(94vw, 420px);
	}
	@media (min-width: 768px) {
		.wrap {
			width: min(94vw, 640px);
		}
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr;
		gap: 8px;
	}
	@media (min-width: 768px) {
		.pair {
			grid-template-columns: 1fr 1fr;
		}
	}
	.panel {
		min-width: 0;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.cap {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.cap.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.on {
		background: var(--color-grass);
	}
	.rows {
		margin: 0;
		padding: 4px 6px;
		list-style: none;
	}
	.rows li {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px;
		border-radius: 8px;
		transition: background 0.2s ease;
	}
	.rows li.used {
		background: var(--color-grass-soft);
	}
	code,
	pre {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	code {
		flex: 1;
		min-width: 0;
		font-size: 11px;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.use {
		flex: none;
		border-radius: 8px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 5px 9px;
		font-size: 11px;
		font-weight: 700;
	}
	.use:disabled {
		background: transparent;
		color: var(--color-grass);
	}
	.up {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px 9px;
		border-top: 1px solid var(--color-line);
	}
	.upbtn {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
	}
	.upbtn:disabled {
		opacity: 0.5;
	}
	.upbtn.ready {
		border-color: var(--color-brand);
		color: var(--color-brand);
		background: var(--color-brand-soft);
		animation: nudge 1.8s ease-in-out infinite;
	}
	@keyframes nudge {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.2);
		}
	}
	.uphint {
		font-size: 11px;
		color: var(--color-faint);
	}
	pre {
		margin: 0;
		padding: 8px 10px;
		background: var(--color-paper);
		font-size: 11px;
		line-height: 1.6;
		color: var(--color-ink);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.tag {
		color: var(--color-brand);
		font-weight: 600;
	}
	.att {
		color: var(--color-amber);
	}
	.str {
		color: var(--color-grass);
	}
	.pun {
		color: var(--color-faint);
	}
	.added {
		display: inline-block;
		border-radius: 4px;
		background: var(--color-brand-soft);
		animation: fade 0.5s ease;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
		min-height: 96px;
		padding: 8px;
		background: #fff;
	}
	@media (min-width: 768px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.empty {
		grid-column: 1 / -1;
		align-self: center;
		margin: 0;
		text-align: center;
		font-size: 11.5px;
		color: #8a949d;
	}
	.card {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 5px;
		border-radius: 9px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		font-size: 10.5px;
		animation: fade 0.35s ease;
	}
	.card b {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.card span {
		color: #5e6b76;
	}
	.ph {
		height: 34px;
		border-radius: 6px;
		overflow: hidden;
	}
	.card .cart {
		margin-top: 3px;
		padding: 3px 0;
		border-radius: 6px;
		background: #2e6fe0;
		color: #fff;
		font-size: 9.5px;
		font-weight: 700;
		text-align: center;
		animation: fade 0.4s ease;
	}
	@keyframes fade {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card,
		.card .cart,
		.added,
		.upbtn.ready {
			animation: none;
		}
		.rows li {
			transition: none;
		}
	}
</style>
