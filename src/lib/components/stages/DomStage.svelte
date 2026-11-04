<script lang="ts">
	// Guided DOM. A small nimbus.com page sits above its DOM tree. Following Nim's beats the tree
	// grows node by node, page parts and tree nodes light up together, JavaScript hangs new li
	// nodes, and a click bubbles from the button up to html while a listener on main hears it.
	// The only play is optional, tapping any part of the page sends its own click up the tree.
	import { onDestroy, untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DomText } from '$lib/chapters/web/dom/types';
	import Guide from '../Guide.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DomText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let view = $state(0);
	$effect(() => {
		view = beat;
	});

	// ---- The tree, a fixed shape plus up to three li nodes JavaScript adds ----
	type N = { id: string; label: string; x: number; y: number; parent?: string };
	const BASE: N[] = [
		{ id: 'html', label: 'html', x: 180, y: 22 },
		{ id: 'body', label: 'body', x: 180, y: 70, parent: 'html' },
		{ id: 'header', label: 'header', x: 55, y: 118, parent: 'body' },
		{ id: 'main', label: 'main', x: 190, y: 118, parent: 'body' },
		{ id: 'footer', label: 'footer', x: 315, y: 118, parent: 'body' },
		{ id: 'h1', label: 'h1', x: 55, y: 166, parent: 'header' },
		{ id: 'h2', label: 'h2', x: 125, y: 166, parent: 'main' },
		{ id: 'button', label: 'button', x: 190, y: 166, parent: 'main' },
		{ id: 'ul', label: 'ul', x: 255, y: 166, parent: 'main' },
		{ id: 'a', label: 'a', x: 315, y: 166, parent: 'footer' }
	];
	const MAX_LI = 3;
	let lis = $state(0);
	let fresh = $state(-1);
	const nodes = $derived([
		...BASE,
		...Array.from({ length: lis }, (_, k) => ({
			id: `li${k}`,
			label: 'li',
			x: 221 + k * 34,
			y: 214,
			parent: 'ul'
		}))
	]);
	const byId = $derived(new Map(nodes.map((n) => [n.id, n])));
	const w = (n: N) => n.label.length * 7 + 18;

	function up(id: string): string[] {
		const out: string[] = [];
		let n = byId.get(id);
		while (n) {
			out.push(n.id);
			n = n.parent ? byId.get(n.parent) : undefined;
		}
		return out;
	}

	// ---- What is lit right now ----
	let reveal = $state(BASE.length);
	let focus = $state<string | null>(null);
	let path = $state<string[]>([]);
	let pi = $state(-1);
	let heard = $state(false);
	let ripple = $state(0);
	const listener = $derived(view >= 6);
	const cur = $derived(pi >= 0 ? path[pi] : null);
	const trail = $derived(new Set(pi >= 0 ? path.slice(0, pi + 1) : []));
	const lit = (id: string) => focus === id || trail.has(id);
	// The little bubble only shows while a click is travelling.
	let bubbling = $state(false);
	const dot = $derived(bubbling && cur ? byId.get(cur) : undefined);

	// ---- A tiny timeline that follows the beat ----
	let timers: ReturnType<typeof setTimeout>[] = [];
	function later(fn: () => void, ms: number) {
		timers.push(setTimeout(fn, ms));
	}
	function stop() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	onDestroy(stop);
	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function addLi() {
		lis = lis >= MAX_LI ? 1 : lis + 1;
		fresh = lis - 1;
		later(() => (fresh = -1), 900);
	}

	/** Sends one click up the tree from `id`. `then` runs once it reaches the top. */
	function bubble(id: string, then?: () => void) {
		path = up(id);
		bubbling = true;
		ripple++;
		if (reduced()) {
			pi = path.length - 1;
			if (listener && path.includes('main')) addLi();
			return;
		}
		pi = 0;
		const hop = () => {
			if (pi >= path.length - 1) {
				later(() => {
					pi = -1;
					then?.();
				}, 900);
				return;
			}
			later(() => {
				pi++;
				if (listener && path[pi] === 'main') {
					heard = true;
					addLi();
					later(() => (heard = false), 700);
				}
				hop();
			}, 560);
		};
		hop();
	}

	function play(v: number) {
		stop();
		focus = null;
		path = [];
		pi = -1;
		bubbling = false;
		heard = false;
		reveal = BASE.length;
		if (v < 3) lis = 0;
		else if (v === 4 || v === 5) lis = Math.max(lis, 1);
		const still = reduced();

		if (v === 0 && !still) {
			reveal = 0;
			const grow = () => {
				if (reveal >= BASE.length) return;
				later(() => {
					reveal++;
					grow();
				}, 320);
			};
			grow();
		} else if (v === 1) {
			// The family line, from the root down to the button.
			// The family line lights up from the root down to the button.
			const line = ['html', 'body', 'main', 'button'];
			const show = (k: number) => {
				path = line.slice(0, k + 1);
				pi = k;
				if (still) return;
				later(() => show(k >= line.length - 1 ? 0 : k + 1), k >= line.length - 1 ? 1800 : 700);
			};
			show(still ? line.length - 1 : 0);
		} else if (v === 2) {
			const order = ['h1', 'h2', 'button', 'ul', 'a', 'header', 'main', 'footer'];
			let k = 0;
			focus = order[0];
			if (!still) {
				const next = () =>
					later(() => {
						k = (k + 1) % order.length;
						focus = order[k];
						next();
					}, 1600);
				next();
			}
		} else if (v === 3) {
			lis = 0;
			focus = 'ul';
			if (still) lis = 1;
			else {
				const grow = () =>
					later(() => {
						addLi();
						grow();
					}, 1700);
				grow();
			}
		} else if (v === 4) {
			focus = 'button';
			ripple++;
			if (!still) {
				const tap = () =>
					later(() => {
						ripple++;
						tap();
					}, 1600);
				tap();
			}
		} else if (v === 5 || v === 6 || v === 8) {
			const loop = () => bubble('button', () => later(loop, 500));
			loop();
		} else if (v === 7) {
			focus = 'main';
		}
	}

	$effect(() => {
		const v = view;
		untrack(() => play(v));
	});

	// ---- Optional play, tap any part of the page ----
	let said = false;
	function tapPage(e: MouseEvent) {
		const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-node]');
		const id = el?.dataset.node ?? 'body';
		stop();
		focus = null;
		bubble(id);
		if (!said) {
			said = true;
			onstate?.('bubble');
		}
	}
</script>

<div class="h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full justify-center pb-28 md:pb-6">
		<Guide steps={tx.steps} active={view} onselect={(k) => (view = k)}>
			{#snippet visual()}
				<div class="flex w-full max-w-[440px] flex-col gap-3">
					<!-- The page. Its parts are buttons so a keyboard can reach them too. -->
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
					<div class="browser" class:lit={lit('html')} onclick={tapPage}>
						<div class="addr"><span class="url">{tx.pageLabel}</span></div>
						<div class="pbody" data-node="body" class:lit={lit('body')}>
							<div class="box" data-node="header" class:lit={lit('header')}>
								<button type="button" class="leaf h1" data-node="h1" class:lit={lit('h1')}
									>{tx.page.heading}</button
								>
							</div>
							<div
								class="box main"
								data-node="main"
								class:lit={lit('main')}
								class:ear={listener}
								class:heard
							>
								{#if listener}<span class="badge">{tx.listening}</span>{/if}
								<button type="button" class="leaf h2" data-node="h2" class:lit={lit('h2')}
									>{tx.page.product}</button
								>
								<button type="button" class="leaf btn" data-node="button" class:lit={lit('button')}
									>{#key ripple}<span class="ring" class:go={cur === 'button' || focus === 'button'}
										></span>{/key}{tx.page.button}</button
								>
								<div class="leaf ul" data-node="ul" class:lit={lit('ul')}>
									{#each Array.from({ length: lis }, (_, k) => k) as k (k)}
										<button
											type="button"
											class="li"
											data-node="li{k}"
											class:lit={lit(`li${k}`)}
											class:fresh={fresh === k}>{tx.page.added}</button
										>
									{/each}
								</div>
							</div>
							<div class="box" data-node="footer" class:lit={lit('footer')}>
								<button type="button" class="leaf link" data-node="a" class:lit={lit('a')}
									>{tx.page.help}</button
								>
							</div>
						</div>
					</div>

					<!-- The tree -->
					<figure class="tree">
						<figcaption>{tx.treeLabel}</figcaption>
						<svg viewBox="0 0 360 236" role="img" aria-label={tx.treeLabel}>
							{#each nodes as n, k (n.id)}
								{@const p = n.parent ? byId.get(n.parent) : undefined}
								{#if p}
									<path
										class="edge"
										class:lit={trail.has(n.id) && trail.has(p.id)}
										class:hide={k < BASE.length && k >= reveal}
										d="M{p.x} {p.y + 11} C{p.x} {p.y + 30} {n.x} {n.y - 30} {n.x} {n.y - 11}"
									/>
								{/if}
							{/each}
							{#each nodes as n, k (n.id)}
								<g
									class="node"
									class:lit={lit(n.id)}
									class:cur={cur === n.id}
									class:ear={listener && n.id === 'main'}
									class:heard={heard && n.id === 'main'}
									class:fresh={n.id === `li${fresh}`}
									class:hide={k < BASE.length && k >= reveal}
								>
									<rect x={n.x - w(n) / 2} y={n.y - 11} width={w(n)} height="22" rx="11" />
									<text x={n.x} y={n.y + 4}>{n.label}</text>
								</g>
							{/each}
							{#if dot}
								<g
									class="bubble"
									style="transform:translate({dot.x + w(dot) / 2 + 2}px,{dot.y - 10}px)"
								>
									<circle r="6" />
									<circle r="2" cx="-2" cy="-2" class="shine" />
								</g>
							{/if}
						</svg>
					</figure>
				</div>
			{/snippet}
		</Guide>
	</div>
</div>

<style>
	.browser {
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
		transition: box-shadow 0.3s;
	}
	.browser.lit {
		box-shadow:
			0 0 0 2px var(--color-brand),
			0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.addr {
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
	}
	.url {
		display: block;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	.pbody {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 8px;
		padding: 8px;
		border-radius: 10px;
		border: 1px solid transparent;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.box {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.leaf {
		position: relative;
		border-radius: 8px;
		padding: 3px 8px;
		color: var(--color-ink);
		border: 1px solid transparent;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.h1 {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
	}
	.h2 {
		font-weight: 700;
		font-size: 13px;
	}
	.btn {
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		padding: 5px 12px;
	}
	.ul {
		display: flex;
		flex: 1 1 100%;
		flex-direction: column;
		gap: 3px;
		min-height: 28px;
		background: var(--color-card);
		border-color: var(--color-line);
	}
	.li {
		text-align: left;
		font-size: 12px;
		color: var(--color-muted);
		border-radius: 6px;
		padding: 1px 6px;
	}
	.li.fresh {
		animation: pop 0.6s ease-out;
	}
	.link {
		font-size: 12.5px;
		color: var(--color-brand);
		text-decoration: underline;
	}
	.pbody.lit,
	.box.lit,
	.leaf.lit,
	.li.lit {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.btn.lit {
		background: var(--color-brand);
		box-shadow: 0 0 0 3px var(--color-brand-soft);
	}
	.main.ear {
		border-color: var(--color-amber);
	}
	.main.heard {
		background: var(--color-amber-soft);
	}
	.badge {
		position: absolute;
		top: -9px;
		right: 10px;
		padding: 1px 8px;
		border-radius: 999px;
		background: var(--color-amber);
		color: #fff;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
	}
	.ring {
		position: absolute;
		inset: -2px;
		border-radius: 999px;
		pointer-events: none;
	}
	.ring.go {
		animation: ripple 0.9s ease-out;
	}

	.tree {
		margin: 0;
		padding: 10px 10px 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	figcaption {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.edge {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.6;
		transition:
			stroke 0.3s,
			opacity 0.4s;
	}
	.edge.lit {
		stroke: var(--color-brand);
		stroke-width: 2.2;
	}
	.node rect {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.4;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.node text {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.node,
	.edge {
		opacity: 1;
		transition: opacity 0.45s;
	}
	.node.hide,
	.edge.hide {
		opacity: 0;
	}
	.node.ear rect {
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.node.heard rect {
		fill: var(--color-amber-soft);
	}
	.node.lit rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.node.cur rect {
		fill: var(--color-brand);
		stroke: var(--color-brand);
	}
	.node.cur text {
		fill: #fff;
	}
	.node.fresh {
		animation: pop 0.6s ease-out;
		transform-box: fill-box;
		transform-origin: center;
	}
	.bubble {
		transition: transform 0.5s ease-in-out;
	}
	.bubble circle {
		fill: color-mix(in srgb, var(--color-brand) 30%, transparent);
		stroke: var(--color-brand);
		stroke-width: 1.4;
	}
	.bubble .shine {
		fill: #fff;
		stroke: none;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes ripple {
		from {
			box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-brand) 55%, transparent);
		}
		to {
			box-shadow: 0 0 0 14px transparent;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bubble,
		.node,
		.edge,
		.node rect,
		.leaf,
		.box,
		.pbody,
		.browser {
			transition: none;
		}
		.li.fresh,
		.node.fresh,
		.ring.go {
			animation: none;
		}
	}
</style>
