<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { DynamicRoutingText } from '$lib/chapters/network/dynamic-routing/types';
	import RouterBox from './delivery/RouterBox.svelte';
	import MiniServer from './delivery/MiniServer.svelte';
	import MiniPhone from './delivery/MiniPhone.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DynamicRoutingText);

	let act = $state(1);
	let actTwoOpen = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];
	const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
	const reduce = () =>
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	// ---------------- Act 1, OSPF inside one company ----------------
	const NODES = [
		{ x: 50, y: 10 },
		{ x: 15, y: 44 },
		{ x: 85, y: 44 },
		{ x: 28, y: 84 },
		{ x: 74, y: 84 }
	];
	const START = 0;
	const END = 4;
	// [from, to, cost], lower cost means a faster link
	const EDGES: [number, number, number][] = [
		[0, 1, 1],
		[0, 2, 3],
		[1, 2, 2],
		[1, 3, 2],
		[3, 4, 1],
		[2, 4, 2]
	];
	const cut = new SvelteSet<number>();
	let flooding = $state(false);
	let shown = $state<{ nodes: number[]; cost: number } | null>(shortest(new Set()));

	/** Plain Dijkstra over the links that are still alive, exactly what OSPF runs. */
	function shortest(dead: Set<number>): { nodes: number[]; cost: number } | null {
		const dist = NODES.map(() => Infinity);
		const prev = NODES.map(() => -1);
		const seen = new Set<number>();
		dist[START] = 0;
		while (seen.size < NODES.length) {
			let u = -1;
			for (let i = 0; i < NODES.length; i++)
				if (!seen.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
			if (u < 0 || dist[u] === Infinity) break;
			seen.add(u);
			EDGES.forEach(([a, b, c], i) => {
				if (dead.has(i)) return;
				const v = a === u ? b : b === u ? a : -1;
				if (v >= 0 && dist[u] + c < dist[v]) {
					dist[v] = dist[u] + c;
					prev[v] = u;
				}
			});
		}
		if (dist[END] === Infinity) return null;
		const nodes = [END];
		while (nodes[0] !== START) nodes.unshift(prev[nodes[0]]);
		return { nodes, cost: dist[END] };
	}
	function toggle(i: number) {
		if (flooding) return;
		const wasCut = cut.has(i);
		if (wasCut) cut.delete(i);
		else cut.add(i);
		const before = shown;
		flooding = true;
		later(
			() => {
				flooding = false;
				shown = shortest(new Set(cut));
				if (!shown) onstate?.('noPath');
				else if (wasCut) onstate?.('restoredLink');
				else if (before?.nodes.join() !== shown.nodes.join()) {
					onstate?.('rerouted');
					actTwoOpen = true;
				} else onstate?.('sameRoad');
			},
			reduce() ? 80 : 1100
		);
	}
	function fixAll() {
		if (flooding) return;
		cut.clear();
		shown = shortest(new Set());
		onstate?.('restoredLink');
	}
	const onPath = (a: number, b: number) => {
		if (!shown || flooding) return false;
		const n = shown.nodes;
		for (let i = 0; i < n.length - 1; i++)
			if ((n[i] === a && n[i + 1] === b) || (n[i] === b && n[i + 1] === a)) return true;
		return false;
	};
	const pathText = $derived(
		shown ? shown.nodes.map((n) => tx.ospf.routers[n]).join(' → ') : tx.ospf.noPath
	);

	// ---------------- Act 2, BGP and the Facebook outage ----------------
	type BNode = 'phone' | 'isp' | 'net' | 'dns' | 'dc1' | 'dc2';
	const BP: Record<BNode, { x: number; y: number }> = {
		phone: { x: 12, y: 15 },
		isp: { x: 45, y: 15 },
		net: { x: 82, y: 15 },
		dns: { x: 50, y: 56 },
		dc1: { x: 22, y: 86 },
		dc2: { x: 78, y: 86 }
	};
	let step = $state(0); // how many outage moments have happened
	let tried = $state(false); // tried at least once in the current moment
	let trying = $state(false);
	let pkt = $state<BNode | ''>('');
	let tryResult = $state<'' | 'ok' | 'fail'>('');
	let finished = false;

	const backboneCut = $derived(step >= 1 && step < 4);
	const announced = $derived(step < 2 || step >= 4);

	function openAct2() {
		act = 2;
		onstate?.('bgpAct');
	}
	function tryOpen() {
		if (trying) return;
		trying = true;
		tryResult = '';
		const path: BNode[] = announced ? ['phone', 'isp', 'net', 'dns'] : ['phone', 'isp'];
		const ms = reduce() ? 60 : 550;
		path.forEach((n, i) => later(() => (pkt = n), i * ms));
		later(
			() => {
				trying = false;
				tried = true;
				tryResult = announced ? 'ok' : 'fail';
				onstate?.(announced ? 'tryOk' : 'tryFail');
			},
			path.length * ms + 100
		);
	}
	function nextMoment() {
		if (trying || step >= 4) return;
		step += 1;
		tried = false;
		tryResult = '';
		pkt = '';
		const tokens = ['', 'backbone', 'withdraw', 'onsite', 'restored'];
		onstate?.(tokens[step]);
		if (step === 4 && !finished) {
			finished = true;
			oncomplete?.();
		}
	}
	// The learner must feel each moment, so a try is needed before the very first step and right
	// after the routes are pulled. The one between (backbone just cut) only lasts minutes.
	const needTry = $derived((step === 0 || step === 2) && !tried);
	const canTry = $derived(step !== 1 && step !== 3);
	const moment = $derived(step > 0 ? tx.bgp.steps[step - 1] : null);
	const bnote = $derived(
		trying
			? ' '
			: tryResult === 'ok'
				? tx.bgp.tryOk
				: tryResult === 'fail'
					? tx.bgp.tryFail
					: (moment?.note ?? tx.bgp.startNote)
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- act row -->
	<div class="actrow">
		{#each tx.acts as name, i (i)}
			<button
				type="button"
				class="act"
				class:on={act === i + 1}
				disabled={i === 1 && !actTwoOpen && act !== 2}
				onclick={() => (i === 0 ? (act = 1) : act !== 2 && openAct2())}
			>
				<span>{tx.actLabel.replace('{n}', String(i + 1))}</span>
				<b>{name}</b>
			</button>
		{/each}
	</div>

	{#if act === 1}
		<div class="acts">
			{#if actTwoOpen}
				<button type="button" class="cta" onclick={openAct2}>{tx.nextAct}</button>
			{/if}
			{#if cut.size > 0}
				<button type="button" class="line" onclick={fixAll} disabled={flooding}
					>{tx.ospf.restoreBtn}</button
				>
			{/if}
		</div>
		<p class="hint">{tx.ospf.cutHint}</p>

		<div class="scene">
			<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each EDGES as [a, b], i (i)}
					<line
						x1={NODES[a].x}
						y1={NODES[a].y}
						x2={NODES[b].x}
						y2={NODES[b].y}
						class:lit={onPath(a, b)}
						class:dead={cut.has(i)}
						vector-effect="non-scaling-stroke"
					/>
				{/each}
			</svg>

			{#if flooding}
				{#each EDGES as [a, b], i (i)}
					{#if !cut.has(i)}
						<span
							class="pulse"
							style="--x1:{NODES[a].x}%;--y1:{NODES[a].y}%;--x2:{NODES[b].x}%;--y2:{NODES[b].y}%"
						></span>
						<span
							class="pulse rev"
							style="--x1:{NODES[b].x}%;--y1:{NODES[b].y}%;--x2:{NODES[a].x}%;--y2:{NODES[a].y}%"
						></span>
					{/if}
				{/each}
			{/if}

			{#each NODES as n, i (i)}
				<div class="node" style="left:{n.x}%;top:{n.y}%">
					<RouterBox
						label={tx.ospf.routers[i]}
						sub={i === START ? tx.ospf.startTag : i === END ? tx.ospf.endTag : ''}
						tone={flooding ? 'warn' : shown?.nodes.includes(i) ? 'active' : 'idle'}
						small
					/>
				</div>
			{/each}

			{#each EDGES as [a, b, c], i (i)}
				<button
					type="button"
					class="cost"
					class:dead={cut.has(i)}
					class:lit={onPath(a, b)}
					style="left:{(NODES[a].x + NODES[b].x) / 2}%;top:{(NODES[a].y + NODES[b].y) / 2}%"
					aria-label={tx.ospf.cutAria
						.replace('{a}', tx.ospf.routers[a])
						.replace('{b}', tx.ospf.routers[b])}
					onclick={() => toggle(i)}
					disabled={flooding}>{cut.has(i) ? '✕' : c}</button
				>
			{/each}
		</div>

		<div class="pathcard" class:none={!shown && !flooding}>
			{#if flooding}
				<span class="flood">{tx.ospf.flooding}</span>
			{:else}
				<span class="plabel">{tx.ospf.pathLabel}</span>
				<b>{pathText}</b>
				{#if shown}<span class="pcost">{tx.ospf.costLabel.replace('{n}', String(shown.cost))}</span
					>{/if}
			{/if}
		</div>
	{:else}
		<div class="acts">
			{#if step < 4}
				<button type="button" class="cta" onclick={nextMoment} disabled={trying || needTry}
					>{tx.bgp.steps[step].btn}</button
				>
			{/if}
			<button
				type="button"
				class="line"
				class:pulse-me={needTry}
				onclick={tryOpen}
				disabled={trying || !canTry}>{tx.bgp.tryBtn}</button
			>
		</div>

		{#if moment}
			{#key step}
				<span class="time">{moment.time}</span>
			{/key}
		{/if}

		<div class="scene bgp">
			<div class="fbbox" class:down={!announced}>
				<span>{tx.bgp.fbLabel}</span>
			</div>
			<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				<line
					x1={BP.phone.x}
					y1={BP.phone.y}
					x2={BP.isp.x}
					y2={BP.isp.y}
					vector-effect="non-scaling-stroke"
				/>
				<line
					x1={BP.isp.x}
					y1={BP.isp.y}
					x2={BP.net.x}
					y2={BP.net.y}
					vector-effect="non-scaling-stroke"
				/>
				<line
					x1={BP.net.x}
					y1={BP.net.y}
					x2={BP.dns.x}
					y2={BP.dns.y}
					class:lit={announced}
					class:dead={!announced}
					vector-effect="non-scaling-stroke"
				/>
				{#each [['dns', 'dc1'], ['dns', 'dc2'], ['dc1', 'dc2']] as [a, b] (a + b)}
					<line
						x1={BP[a as BNode].x}
						y1={BP[a as BNode].y}
						x2={BP[b as BNode].x}
						y2={BP[b as BNode].y}
						class:dead={backboneCut}
						vector-effect="non-scaling-stroke"
					/>
				{/each}
			</svg>

			<div class="node" style="left:{BP.phone.x}%;top:{BP.phone.y}%">
				<MiniPhone
					label={tx.bgp.phoneLabel}
					phase={trying
						? 'loading'
						: tryResult === 'ok'
							? 'loaded'
							: tryResult === 'fail'
								? 'offline'
								: 'idle'}
				/>
			</div>
			<div class="node" style="left:{BP.isp.x}%;top:{BP.isp.y}%">
				<RouterBox label={tx.bgp.ispLabel} tone={tryResult === 'fail' ? 'down' : 'idle'} small />
			</div>
			<div class="node" style="left:{BP.net.x}%;top:{BP.net.y}%">
				<div class="cloud">
					<svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true">
						<path
							d="M12 26h22a8 8 0 0 0 1-16 11 11 0 0 0-21-2A9 9 0 0 0 12 26Z"
							fill="var(--color-card)"
							stroke="var(--color-faint)"
							stroke-width="1.5"
						/>
					</svg>
					<b>{tx.bgp.netLabel}</b>
				</div>
			</div>
			<div class="node" style="left:{BP.dns.x}%;top:{BP.dns.y}%">
				<MiniServer label={tx.bgp.dnsLabel} active={tryResult === 'ok'} />
			</div>
			<div class="node" style="left:{BP.dc1.x}%;top:{BP.dc1.y}%">
				<MiniServer label={tx.bgp.dcLabel} slots={3} active={!backboneCut} />
			</div>
			<div class="node" style="left:{BP.dc2.x}%;top:{BP.dc2.y}%">
				<MiniServer label={tx.bgp.dcLabel} slots={3} active={!backboneCut} />
			</div>
			{#if step === 3}
				<span class="crew" style="left:{BP.dc1.x + 14}%;top:{BP.dc1.y - 6}%" aria-hidden="true">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="8" r="4" fill="var(--color-amber)" />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-amber)" />
					</svg>
				</span>
			{/if}

			{#if pkt}
				<span
					class="bpkt"
					class:fail={tryResult === 'fail'}
					style="left:{BP[pkt].x}%;top:{BP[pkt].y}%"
				></span>
			{/if}
			{#if tryResult === 'fail'}
				<span class="qmark" style="left:{BP.isp.x}%;top:{BP.isp.y}%">?</span>
			{/if}
		</div>

		<div class="bgptable">
			<b class="ttl">{tx.bgp.tableTitle}</b>
			<div class="entry" class:gone={!announced}>
				<code>{tx.bgp.routeEntry}</code>
				{#if !announced}<span class="wd">{tx.bgp.withdrawn}</span>{/if}
			</div>
		</div>
		<p class="note">{bnote}</p>
	{/if}
</div>

<style>
	.actrow {
		display: flex;
		gap: 6px;
	}
	.act {
		display: flex;
		align-items: baseline;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.act b {
		color: var(--color-ink);
	}
	.act.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.act.on b,
	.act.on span {
		color: var(--color-brand);
	}
	.act:disabled {
		opacity: 0.5;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		min-height: 0;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:enabled:hover {
		border-color: var(--color-ink);
	}
	.line.pulse-me {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 16%, transparent);
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.5;
	}
	.hint {
		font-size: 11.5px;
		color: var(--color-muted);
		text-align: center;
		max-width: 320px;
	}

	.scene {
		position: relative;
		width: min(94vw, 340px);
		height: 230px;
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
		stroke-width: 3;
		stroke-linecap: round;
		transition:
			stroke 0.3s ease,
			opacity 0.3s ease;
	}
	.wires line.lit {
		stroke: var(--color-brand);
	}
	.wires line.dead {
		stroke: var(--color-danger);
		opacity: 0.3;
	}
	.node {
		position: absolute;
		transform: translate(-50%, -50%);
		z-index: 1;
	}
	.cost {
		position: absolute;
		z-index: 2;
		transform: translate(-50%, -50%);
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 11px;
		font-weight: 800;
		transition:
			border-color 0.2s ease,
			transform 0.15s ease;
	}
	.cost:enabled:hover {
		transform: translate(-50%, -50%) scale(1.12);
		border-color: var(--color-ink);
	}
	.cost.lit {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.cost.dead {
		border-color: var(--color-danger);
		color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.pulse {
		position: absolute;
		z-index: 1;
		width: 7px;
		height: 7px;
		margin: -3.5px;
		border-radius: 50%;
		background: var(--color-amber);
		animation: flood 0.5s ease-in-out 2;
	}
	.pulse.rev {
		animation-delay: 0.1s;
	}
	@keyframes flood {
		from {
			left: var(--x1);
			top: var(--y1);
		}
		to {
			left: var(--x2);
			top: var(--y2);
		}
	}
	.pathcard {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		gap: 4px 8px;
		max-width: min(94vw, 360px);
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 12px;
		font-size: 12px;
		min-height: 34px;
	}
	.pathcard b {
		color: var(--color-brand);
	}
	.pathcard.none b {
		color: var(--color-danger);
	}
	.plabel,
	.pcost {
		font-size: 10.5px;
		color: var(--color-faint);
		font-weight: 700;
	}
	.flood {
		color: var(--color-amber);
		font-weight: 700;
	}

	/* act 2 */
	.time {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-ink);
		font-size: 11px;
		font-weight: 700;
		padding: 3px 11px;
		animation: popin 0.3s ease;
	}
	.scene.bgp {
		height: 240px;
	}
	.fbbox {
		position: absolute;
		left: 4%;
		right: 4%;
		top: 42%;
		bottom: 0;
		border-radius: 16px;
		border: 1.5px solid color-mix(in srgb, var(--color-brand) 30%, transparent);
		background: color-mix(in srgb, var(--color-brand) 5%, transparent);
		transition:
			border-color 0.3s ease,
			background 0.3s ease;
	}
	.fbbox.down {
		border-color: color-mix(in srgb, var(--color-danger) 35%, transparent);
		background: color-mix(in srgb, var(--color-danger) 5%, transparent);
	}
	.fbbox span {
		position: absolute;
		top: 6px;
		left: 10px;
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-brand);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.fbbox.down span {
		color: var(--color-danger);
	}
	.cloud {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.cloud b {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.crew {
		position: absolute;
		z-index: 2;
		animation: popin 0.3s ease;
	}
	.bpkt {
		position: absolute;
		z-index: 3;
		width: 12px;
		height: 12px;
		margin: -6px;
		border-radius: 50%;
		background: var(--color-brand);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 20%, transparent);
		transition:
			left 0.5s ease-in-out,
			top 0.5s ease-in-out;
	}
	.bpkt.fail {
		background: var(--color-danger);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-danger) 20%, transparent);
	}
	.qmark {
		position: absolute;
		z-index: 4;
		transform: translate(60%, -150%);
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-danger);
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: popin 0.25s ease;
	}
	.bgptable {
		width: min(94vw, 340px);
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.ttl {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.entry {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.entry code {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
		transition: color 0.3s ease;
	}
	.entry.gone code {
		color: var(--color-faint);
		text-decoration: line-through;
	}
	.wd {
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 8px;
		animation: popin 0.25s ease;
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	@keyframes popin {
		from {
			opacity: 0;
			scale: 0.6;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	:global(.dark) .cta {
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.pulse {
			display: none;
		}
		.bpkt {
			transition: none;
		}
		.time,
		.wd,
		.qmark,
		.crew {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.scene,
		.bgptable {
			width: 460px;
		}
		.scene {
			height: 280px;
		}
		.scene.bgp {
			height: 290px;
		}
		.hint,
		.pathcard,
		.note {
			font-size: 14px;
		}
		.note {
			max-width: 460px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
