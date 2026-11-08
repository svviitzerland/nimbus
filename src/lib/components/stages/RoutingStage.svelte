<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { RoutingText } from '$lib/chapters/network/routing/types';
	import RouterBox from './delivery/RouterBox.svelte';
	import MiniLaptop from './delivery/MiniLaptop.svelte';
	import MiniServer from './delivery/MiniServer.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as RoutingText);

	type NodeId = 'lap' | 'A' | 'B' | 'C' | 'srv' | 'files';
	// Node centres in percent of the scene, laid out top to bottom so it fits a phone.
	const POS: Record<NodeId, { x: number; y: number }> = {
		lap: { x: 50, y: 11 },
		A: { x: 50, y: 39 },
		B: { x: 22, y: 64 },
		C: { x: 78, y: 64 },
		srv: { x: 22, y: 89 },
		files: { x: 78, y: 89 }
	};
	const LINKS: [NodeId, NodeId][] = [
		['lap', 'A'],
		['A', 'B'],
		['A', 'C'],
		['B', 'srv'],
		['C', 'files']
	];

	let route = $state<'' | 'B' | 'C'>('');
	let sending = $state(false);
	let at = $state<NodeId | ''>('');
	let trail = $state<NodeId[]>([]);
	let outcome = $state<'' | 'ok' | 'drop'>('');
	let dropAt = $state<NodeId | ''>('');
	let delivered = false;
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const reduce = () =>
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function send() {
		if (sending) return;
		clear();
		sending = true;
		outcome = '';
		dropAt = '';
		// Work out the whole hop by hop path first, the routers consult their tables in turn.
		const path: NodeId[] = ['lap', 'A'];
		let stop: NodeId = 'A';
		let ok = false;
		if (route === 'B') {
			path.push('B', 'srv');
			ok = true;
		} else if (route === 'C') {
			path.push('C');
			stop = 'C';
		}
		const step = reduce() ? 60 : 650;
		trail = [];
		at = 'lap';
		path.forEach((n, i) => {
			timers.push(
				setTimeout(() => {
					at = n;
					trail = path.slice(0, i + 1);
				}, i * step)
			);
		});
		timers.push(
			setTimeout(
				() => {
					sending = false;
					if (ok) {
						outcome = 'ok';
						delivered = true;
						onstate?.('delivered');
					} else {
						outcome = 'drop';
						dropAt = stop;
						if (route === 'C') onstate?.('wrongWay');
						else if (delivered) {
							onstate?.('lost');
							if (!done) {
								done = true;
								oncomplete?.();
							}
						} else onstate?.('noRoute');
					}
				},
				path.length * step + 120
			)
		);
	}

	function setRoute(r: 'B' | 'C') {
		if (sending) return;
		route = r;
		reset();
		onstate?.('added');
	}
	function del() {
		if (sending) return;
		route = '';
		reset();
		if (delivered) onstate?.('deleted');
	}
	function reset() {
		at = '';
		trail = [];
		outcome = '';
		dropAt = '';
	}

	const nameOf = (n: NodeId | '') =>
		n === 'A' ? tx.routerA : n === 'B' ? tx.routerB : n === 'C' ? tx.routerC : '';
	const note = $derived(
		sending
			? ' '
			: outcome === 'ok'
				? tx.noteDelivered
				: outcome === 'drop'
					? (dropAt === 'C' ? tx.noteWrong : tx.noteNoRoute).replace('{name}', nameOf(dropAt))
					: tx.noteIdle
	);
	const lit = (a: NodeId, b: NodeId) => {
		const i = trail.indexOf(a);
		return i >= 0 && trail[i + 1] === b;
	};
	const tone = (n: NodeId) =>
		dropAt === n ? 'down' : at === n || trail.includes(n) ? 'active' : 'idle';

	onDestroy(clear);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="acts">
		<button type="button" class="cta" onclick={send} disabled={sending}>{tx.sendBtn}</button>
	</div>

	<!-- Router A's routing table, the thing the learner edits -->
	<div class="table">
		<b class="ttl">{tx.tableTitle.replace('{name}', tx.routerA)}</b>
		<div class="row head">
			<span>{tx.destCol}</span>
			<span>{tx.hopCol}</span>
		</div>
		{#if route}
			<div class="row entry">
				<code>{tx.destValue}</code>
				<code class="hop">{route === 'B' ? tx.viaB : tx.viaC}</code>
				<button type="button" class="del" onclick={del} disabled={sending}>{tx.deleteBtn}</button>
			</div>
		{:else}
			<div class="row empty"><span>{tx.emptyRow}</span></div>
		{/if}
		<div class="pick">
			<span>{tx.pickHop}</span>
			<div class="chips">
				<button
					type="button"
					class="chip"
					class:on={route === 'B'}
					onclick={() => setRoute('B')}
					disabled={sending}>{tx.viaB}</button
				>
				<button
					type="button"
					class="chip"
					class:on={route === 'C'}
					onclick={() => setRoute('C')}
					disabled={sending}>{tx.viaC}</button
				>
			</div>
		</div>
	</div>

	<div class="scene">
		<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			{#each LINKS as [a, b] (a + b)}
				<line
					x1={POS[a].x}
					y1={POS[a].y}
					x2={POS[b].x}
					y2={POS[b].y}
					class:lit={lit(a, b)}
					vector-effect="non-scaling-stroke"
				/>
			{/each}
		</svg>

		<div class="node" style="left:{POS.lap.x}%;top:{POS.lap.y}%">
			<MiniLaptop label={tx.laptopLabel} led={outcome === 'ok' ? 'ok' : 'off'} />
		</div>
		<div class="node" style="left:{POS.A.x}%;top:{POS.A.y}%">
			<RouterBox label={tx.routerA} tone={tone('A')} />
		</div>
		<div class="node" style="left:{POS.B.x}%;top:{POS.B.y}%">
			<RouterBox label={tx.routerB} sub={tx.knowsB} tone={tone('B')} small />
		</div>
		<div class="node" style="left:{POS.C.x}%;top:{POS.C.y}%">
			<RouterBox label={tx.routerC} sub={tx.knowsC} tone={tone('C')} small />
		</div>
		<div class="node" style="left:{POS.srv.x}%;top:{POS.srv.y}%">
			<MiniServer label={tx.serverLabel} sub={tx.serverSub} active={outcome === 'ok'} />
		</div>
		<div class="node" style="left:{POS.files.x}%;top:{POS.files.y}%">
			<MiniServer label={tx.filesLabel} />
		</div>

		{#if at}
			<div
				class="packet"
				class:gone={outcome === 'drop'}
				style="left:{POS[at].x}%;top:{POS[at].y}%"
			>
				{tx.packetChip}
			</div>
		{/if}
		{#if outcome === 'drop' && dropAt}
			<span class="tag no" style="left:{POS[dropAt].x}%;top:{POS[dropAt].y}%">{tx.lostTag}</span>
		{/if}
		{#if outcome === 'ok'}
			<span class="tag" style="left:{POS.srv.x}%;top:{POS.srv.y}%">{tx.okTag}</span>
		{/if}
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.acts {
		display: flex;
		justify-content: center;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.55;
	}

	.table {
		width: min(94vw, 340px);
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.ttl {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		align-items: center;
		gap: 6px;
		font-size: 11px;
	}
	.row.head {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-muted);
		border-bottom: 1px solid var(--color-line);
		padding-bottom: 3px;
	}
	.row.entry code {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
		animation: popin 0.25s ease;
	}
	.row.entry .hop {
		color: var(--color-brand);
	}
	.row.empty span {
		grid-column: 1 / -1;
		font-size: 11px;
		font-style: italic;
		color: var(--color-faint);
	}
	.del {
		border-radius: 8px;
		border: 1px solid color-mix(in srgb, var(--color-danger) 40%, transparent);
		color: var(--color-danger);
		background: transparent;
		padding: 3px 8px;
		font-size: 10px;
		font-weight: 700;
	}
	.del:enabled:hover {
		background: var(--color-danger-soft);
	}
	.pick {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		border-top: 1px solid var(--color-line);
		padding-top: 6px;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.chips {
		display: flex;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 4px 10px;
		font-size: 10.5px;
		font-weight: 700;
		transition: border-color 0.2s ease;
	}
	.chip:enabled:hover {
		border-color: var(--color-ink);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip:disabled,
	.del:disabled {
		opacity: 0.55;
	}

	.scene {
		position: relative;
		width: min(94vw, 340px);
		height: 250px;
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.wires line {
		stroke: var(--color-line);
		stroke-width: 2.5;
		stroke-linecap: round;
		transition: stroke 0.3s ease;
	}
	.wires line.lit {
		stroke: var(--color-brand);
	}
	.node {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 1;
		/* a soft backdrop so wires do not cross the captions */
		background: radial-gradient(closest-side, var(--color-paper) 70%, transparent);
		padding: 2px 4px;
	}
	.packet {
		position: absolute;
		z-index: 3;
		transform: translate(-50%, -150%);
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-size: 9.5px;
		font-weight: 800;
		padding: 3px 8px;
		white-space: nowrap;
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.2);
		transition:
			left 0.55s ease-in-out,
			top 0.55s ease-in-out,
			opacity 0.4s ease;
	}
	.packet.gone {
		background: var(--color-danger);
		opacity: 0.35;
	}
	.tag {
		position: absolute;
		z-index: 4;
		transform: translate(-50%, 90%);
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 9px;
		animation: popin 0.25s ease;
	}
	.tag.no {
		background: var(--color-danger);
	}
	@keyframes popin {
		from {
			opacity: 0;
			scale: 0.5;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	:global(.dark) .cta,
	:global(.dark) .table {
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.packet {
			transition: none;
		}
		.tag,
		.row.entry code {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.table,
		.scene {
			width: 460px;
		}
		.scene {
			height: 290px;
		}
		.row,
		.row.entry code {
			font-size: 12.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.cta {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
