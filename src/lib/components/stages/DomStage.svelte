<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DomText, DomStep } from '$lib/chapters/web/dom/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as DomText);

	// ---- The tree. Fixed nodes plus the li items the listener adds to the cart list ----
	type Node = { id: string; tag: string; parent: string | null; depth: number };
	const FIXED: Node[] = [
		{ id: 'document', tag: 'document', parent: null, depth: 0 },
		{ id: 'html', tag: 'html', parent: 'document', depth: 1 },
		{ id: 'body', tag: 'body', parent: 'html', depth: 2 },
		{ id: 'header', tag: 'header', parent: 'body', depth: 3 },
		{ id: 'h1', tag: 'h1', parent: 'header', depth: 4 },
		{ id: 'main', tag: 'main', parent: 'body', depth: 3 },
		{ id: 'p', tag: 'p', parent: 'main', depth: 4 },
		{ id: 'button', tag: 'button', parent: 'main', depth: 4 },
		{ id: 'ul', tag: 'ul', parent: 'main', depth: 4 },
		{ id: 'footer', tag: 'footer', parent: 'body', depth: 3 },
		{ id: 'a', tag: 'a', parent: 'footer', depth: 4 }
	];
	const MAX_ITEMS = 3;
	let items = $state(0);
	const nodes = $derived.by(() => {
		const out: Node[] = [];
		for (const n of FIXED) {
			out.push(n);
			if (n.id === 'ul')
				for (let i = 0; i < items; i++)
					out.push({ id: `li${i}`, tag: 'li', parent: 'ul', depth: 5 });
		}
		return out;
	});
	function parentOf(id: string): string | null {
		if (id.startsWith('li')) return 'ul';
		return FIXED.find((n) => n.id === id)?.parent ?? null;
	}
	function pathOf(id: string): string[] {
		const out: string[] = [];
		let cur: string | null = id;
		while (cur) {
			out.push(cur);
			cur = parentOf(cur);
		}
		return out;
	}
	const tagOf = (id: string) => (id.startsWith('li') ? 'li' : id);
	const show = (id: string) => (id === 'document' ? 'document' : `<${tagOf(id)}>`);

	// ---- Steps ----
	const STEPS: DomStep[] = ['find', 'bubble', 'listen'];
	let step = $state(0);
	let found = $state<string[]>([]);
	let selected = $state<string | null>(null);
	const selPath = $derived(selected ? pathOf(selected) : []);
	let hot = $state<string | null>(null);
	let trail = $state<string[]>([]);
	let listener = $state<string | null>(null);
	let result = $state<{ kind: 'hit' | 'miss'; node: string } | null>(null);
	let newest = $state<string | null>(null);
	let busy = false;
	let alive = true;
	let finished = $state(false);
	const said: Record<string, boolean> = {};
	function say(token: string, once = true) {
		if (once && said[token]) return;
		said[token] = true;
		onstate?.(token);
	}
	onDestroy(() => (alive = false));

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

	/** Walk the click up the tree, one parent at a time. Returns true if the listener heard it. */
	async function bubble(target: string): Promise<boolean> {
		const path = pathOf(target);
		const gap = reduced() ? 0 : 300;
		trail = [];
		let heard = false;
		for (const id of path) {
			if (!alive) return false;
			hot = id;
			trail = [...trail, id];
			if (listener === id) heard = true;
			if (gap) await wait(gap);
		}
		if (gap) await wait(gap);
		hot = null;
		return heard;
	}

	async function tapPage(id: string) {
		if (busy) return;
		selected = id;
		if (step === 0) {
			if (!found.includes(id)) found = [...found, id];
			if (found.length >= 2) {
				step = 1;
				say('found');
			}
			return;
		}
		busy = true;
		result = null;
		const heard = await bubble(id);
		busy = false;
		if (!alive) return;
		if (step === 1) {
			step = 2;
			say('bubble');
			return;
		}
		if (!listener) return;
		if (heard) {
			if (items < MAX_ITEMS) {
				items += 1;
				newest = `li${items - 1}`;
			}
			result = { kind: 'hit', node: listener };
			if (!finished) {
				finished = true;
				say('grow');
				oncomplete?.();
			} else if (id !== 'button') say('anywhere');
		} else {
			result = { kind: 'miss', node: listener };
			say('miss', false);
		}
	}

	function tapTree(id: string) {
		if (busy) return;
		if (step === 2) {
			listener = id;
			result = null;
			return;
		}
		selected = id;
		if (step === 0 && id !== 'document') {
			if (!found.includes(id)) found = [...found, id];
			if (found.length >= 2) {
				step = 1;
				say('found');
			}
		}
	}

	function clearCart() {
		items = 0;
		newest = null;
		result = null;
	}

	function cls(id: string) {
		return {
			hot: hot === id,
			sel: !hot && selected === id,
			path: !hot && selPath.includes(id),
			trail: trail.includes(id)
		};
	}

	const resultText = $derived(
		result ? (result.kind === 'hit' ? tx.hit : tx.miss).replace('{node}', show(result.node)) : ''
	);
	const listenerCode = $derived(
		listener
			? `${listener === 'document' ? 'document' : `document.querySelector('${tagOf(listener)}')`}\n  .addEventListener('click', addToCart);`
			: ''
	);
</script>

<div class="wrap">
	<ol class="stepper">
		{#each STEPS as s, i (s)}
			<li class:on={step === i} class:ok={step > i || (i === 2 && finished)}>
				<span class="num">{i + 1}</span>
				{tx.steps[s]}
			</li>
		{/each}
	</ol>
	<p class="prompt">{tx.prompts[STEPS[step]]}</p>

	<div class="work">
		<!-- The page as you see it -->
		<div class="pane">
			<div class="addr">
				<span class="led" class:on={finished}></span>
				<span class="url">{tx.pageLabel}</span>
			</div>
			<div class="page" class:hot={hot === 'body' || hot === 'html' || hot === 'document'}>
				<div class="box" class:hot={hot === 'header'} class:path={cls('header').path}>
					<span class="tagname">header</span>
					<button
						type="button"
						class="el h1"
						class:hot={hot === 'h1'}
						class:sel={cls('h1').sel}
						onclick={() => tapPage('h1')}>{tx.page.heading}</button
					>
				</div>
				<div class="box" class:hot={hot === 'main'} class:path={cls('main').path}>
					<span class="tagname">main</span>
					<button
						type="button"
						class="el p"
						class:hot={hot === 'p'}
						class:sel={cls('p').sel}
						onclick={() => tapPage('p')}>{tx.page.product}</button
					>
					<button
						type="button"
						class="el btn"
						class:hot={hot === 'button'}
						class:sel={cls('button').sel}
						class:listen={listener === 'button'}
						onclick={() => tapPage('button')}>{tx.page.button}</button
					>
					<div class="cartlist" class:hot={hot === 'ul'} class:path={cls('ul').path}>
						<span class="tagname">ul</span>
						{#each Array.from({ length: items }, (_, i) => `li${i}`) as li (li)}
							<button
								type="button"
								class="el li"
								class:fresh={newest === li}
								class:hot={hot === li}
								class:sel={cls(li).sel}
								onclick={() => tapPage(li)}>{tx.page.added}</button
							>
						{/each}
					</div>
				</div>
				<div class="box" class:hot={hot === 'footer'} class:path={cls('footer').path}>
					<span class="tagname">footer</span>
					<button
						type="button"
						class="el a"
						class:hot={hot === 'a'}
						class:sel={cls('a').sel}
						onclick={() => tapPage('a')}>{tx.page.help}</button
					>
				</div>
			</div>
		</div>

		<!-- The same page as the browser keeps it, a tree -->
		<div class="pane">
			<div class="addr"><span class="tlabel">{tx.treeLabel}</span></div>
			<ul class="tree" aria-label={tx.treeLabel}>
				{#each nodes as n (n.id)}
					{@const c = cls(n.id)}
					<li>
						<button
							type="button"
							class="row"
							class:hot={c.hot}
							class:sel={c.sel}
							class:path={c.path}
							class:fresh={newest === n.id}
							class:pick={step === 2}
							onclick={() => tapTree(n.id)}
						>
							{#each Array.from({ length: n.depth }, (_, i) => i) as g (g)}<span
									class="guide"
									aria-hidden="true"
								></span>{/each}
							<span class="tg">{show(n.id)}</span>
							{#if listener === n.id}
								<span class="ear">{tx.listening}</span>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	{#if trail.length}
		<div class="trail" aria-live="polite">
			<span class="tcap">{tx.trailLabel}</span>
			{#each trail as t, i (t)}
				{#if i > 0}
					<svg class="arrow" viewBox="0 0 12 12" aria-hidden="true"
						><path
							d="M2 6h7M6 3l3 3-3 3"
							fill="none"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					>
				{/if}
				<span class="step" class:hit={listener === t && step === 2}>{show(t)}</span>
			{/each}
		</div>
	{/if}

	{#if step === 2 && listener}
		<pre class="code">{listenerCode}</pre>
	{/if}
	{#if resultText}
		<div class="result" class:ok={result?.kind === 'hit'} role="status">
			<span>{resultText}</span>
			{#if items > 0}
				<button type="button" class="clear" onclick={clearCart}>{tx.clear}</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		width: min(94vw, 720px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.stepper {
		display: flex;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.stepper li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px 4px 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 600;
	}
	.stepper .num {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-paper);
		font-size: 11px;
	}
	.stepper li.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.stepper li.on .num {
		background: var(--color-brand);
		color: #fff;
	}
	.stepper li.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.stepper li.ok .num {
		background: var(--color-grass);
		color: #fff;
	}
	.prompt {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}

	.work {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		width: 100%;
		max-width: 420px;
	}
	@media (min-width: 640px) {
		.work {
			grid-template-columns: 1.1fr 1fr;
			max-width: 680px;
		}
	}
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
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-muted);
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		flex: 1;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	.tlabel {
		font-weight: 700;
		color: var(--color-ink);
	}

	/* ---- The page ---- */
	.page {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 10px;
		border-radius: 0 0 14px 14px;
		transition: background 0.2s ease;
	}
	.page.hot {
		background: var(--color-amber-soft);
	}
	.box,
	.cartlist {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;
		padding: 16px 9px 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.cartlist {
		width: 100%;
		min-height: 34px;
		padding-top: 15px;
	}
	.box.path,
	.cartlist.path {
		border-color: var(--color-brand);
	}
	.box.hot,
	.cartlist.hot {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.tagname {
		position: absolute;
		top: 2px;
		left: 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.el {
		max-width: 100%;
		text-align: left;
		border-radius: 7px;
		padding: 2px 5px;
		color: var(--color-ink);
		outline-offset: 1px;
		transition:
			background 0.2s ease,
			box-shadow 0.2s ease;
	}
	.el.h1 {
		font-family: var(--font-display, inherit);
		font-size: 17px;
		font-weight: 700;
	}
	.el.p {
		font-size: 13px;
		color: var(--color-muted);
	}
	.el.btn {
		padding: 6px 13px;
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-size: 12.5px;
		font-weight: 600;
	}
	.el.li {
		font-size: 12px;
		color: var(--color-grass);
		font-weight: 600;
	}
	.el.a {
		font-size: 12.5px;
		color: var(--color-brand);
		text-decoration: underline;
	}
	.el.sel {
		box-shadow: 0 0 0 2px var(--color-brand);
	}
	.el.hot {
		box-shadow: 0 0 0 3px var(--color-amber);
	}
	.el.btn.listen {
		box-shadow: 0 0 0 3px var(--color-grass);
	}
	.el.fresh {
		animation: grow 0.5s ease both;
	}

	/* ---- The tree ---- */
	.tree {
		margin: 0;
		padding: 6px;
		list-style: none;
	}
	.row {
		display: flex;
		align-items: stretch;
		width: 100%;
		min-height: 24px;
		border-radius: 7px;
		text-align: left;
		transition: background 0.2s ease;
	}
	.row:hover {
		background: var(--color-paper);
	}
	.guide {
		flex: none;
		width: 13px;
		border-left: 1px solid var(--color-line);
		margin-left: 6px;
	}
	.guide:first-child {
		margin-left: 4px;
	}
	.tg {
		align-self: center;
		padding: 1px 6px;
		border-radius: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		color: var(--color-ink);
	}
	.row.path .tg {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.row.sel .tg {
		background: var(--color-brand);
		color: #fff;
	}
	.row.hot .tg {
		background: var(--color-amber);
		color: #fff;
	}
	.row.fresh .tg {
		background: var(--color-grass-soft);
		color: var(--color-grass);
		animation: grow 0.5s ease both;
	}
	.row.pick:hover .tg {
		outline: 1.5px solid var(--color-grass);
	}
	.ear {
		align-self: center;
		margin-left: 6px;
		padding: 1px 7px;
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-size: 10.5px;
		font-weight: 700;
	}
	@keyframes grow {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* ---- Trail, code, result ---- */
	.trail {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 4px;
		max-width: 100%;
		font-size: 12px;
	}
	.tcap {
		color: var(--color-faint);
		font-weight: 600;
		margin-right: 2px;
	}
	.trail .step {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		padding: 1px 6px;
		border-radius: 6px;
		background: var(--color-amber-soft);
		color: var(--color-ink);
	}
	.trail .step.hit {
		background: var(--color-grass);
		color: #fff;
	}
	.arrow {
		width: 12px;
		height: 12px;
		color: var(--color-faint);
	}
	.code {
		margin: 0;
		max-width: 100%;
		padding: 7px 11px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		color: var(--color-ink);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.result {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-ink);
		font-size: 12.5px;
		font-weight: 600;
	}
	.result.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.clear {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-decoration: underline;
	}

	@media (prefers-reduced-motion: reduce) {
		.page,
		.box,
		.cartlist,
		.el,
		.row {
			transition: none;
		}
		.el.fresh,
		.row.fresh .tg {
			animation: none;
		}
	}
</style>
