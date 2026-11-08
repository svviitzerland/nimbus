<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { KubernetesText } from '$lib/chapters/devops/kubernetes/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as KubernetesText);

	const range = (n: number) => Array.from({ length: n }, (_v, i) => i);
	const NODES = 3;
	const CAP = 4; // pods that fit on one node
	const MIN = 1;
	const MAX = 10;
	const UNPLUG = 1; // the node the learner can unplug (node 2)

	type Pod = { id: number; node: number; status: 'pending' | 'starting' | 'running' | 'dying' };
	let nextId = 0;
	const fresh = (node: number): Pod => ({ id: nextId++, node, status: 'running' });
	let pods = $state<Pod[]>([fresh(0), fresh(1), fresh(2), fresh(0), fresh(1)]);
	let desired = $state(5);
	let nodeUp = $state<boolean[]>([true, true, true]);
	let kills = 0;
	let done = false;
	type Reason = 'kill' | 'scaleUp' | 'scaleDown' | 'nodeDown' | 'nodeBack';
	let reason: Reason | null = null;
	let loop: ReturnType<typeof setTimeout> | undefined;
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	const running = $derived(pods.filter((p) => p.status === 'running').length);
	const starting = $derived(pods.filter((p) => p.status === 'starting').length);
	const pending = $derived(pods.filter((p) => p.status === 'pending').length);
	const planeText = $derived(
		pending > 0
			? tx.planePending.replace('{n}', String(pending))
			: starting > 0 || running !== desired
				? tx.planeFixing.replace('{n}', String(Math.max(starting, desired - running, 1)))
				: tx.planeWatching
	);
	const calm = $derived(running === desired && pending === 0 && starting === 0);

	// The control loop. Compare what you want with what runs, then fix the difference.
	function schedule(delay: number) {
		if (loop) clearTimeout(loop);
		loop = setTimeout(reconcile, delay);
	}
	function load(n: number) {
		return pods.filter((p) => p.node === n && p.status !== 'dying').length;
	}
	function reconcile() {
		const live = pods.filter((p) => p.status !== 'dying');
		if (live.length > desired) {
			// remove the extras, pending ones first, then the newest
			const extra = [...live]
				.sort(
					(a, b) =>
						(a.status === 'pending' ? -1 : 0) - (b.status === 'pending' ? -1 : 0) || b.id - a.id
				)
				.slice(0, live.length - desired)
				.map((p) => p.id);
			pods = pods.map((p) => (extra.includes(p.id) ? { ...p, status: 'dying' } : p));
			at(450, () => (pods = pods.filter((p) => p.status !== 'dying')));
		} else {
			for (let i = live.length; i < desired; i++)
				pods.push({ id: nextId++, node: -1, status: 'pending' });
		}
		// place every pending pod on the up node with the most room
		for (const p of pods) {
			if (p.status !== 'pending') continue;
			let best = -1;
			for (let n = 0; n < NODES; n++) {
				if (!nodeUp[n] || load(n) >= CAP) continue;
				if (best < 0 || load(n) < load(best)) best = n;
			}
			if (best >= 0) {
				p.node = best;
				p.status = 'starting';
			}
		}
		at(800, () => {
			for (const p of pods) if (p.status === 'starting') p.status = 'running';
			report();
		});
	}
	function report() {
		const r = reason;
		reason = null;
		if (!r) return;
		if (r === 'kill') {
			kills += 1;
			if (kills >= 2) {
				onstate?.('healed2');
				if (!done) {
					done = true;
					oncomplete?.();
				}
			} else onstate?.('healed');
		} else onstate?.(r);
	}

	function kill(p: Pod) {
		if (p.status !== 'running') return;
		p.status = 'dying';
		at(450, () => (pods = pods.filter((x) => x.id !== p.id)));
		reason = 'kill';
		schedule(1000);
	}
	function scale(by: number) {
		const v = Math.min(MAX, Math.max(MIN, desired + by));
		if (v === desired) return;
		desired = v;
		reason = by > 0 ? 'scaleUp' : 'scaleDown';
		schedule(400);
	}
	function togglePlug() {
		const up = !nodeUp[UNPLUG];
		nodeUp[UNPLUG] = up;
		if (!up) {
			for (const p of pods) if (p.node === UNPLUG) p.status = 'dying';
			at(450, () => (pods = pods.filter((x) => x.status !== 'dying')));
		}
		reason = up ? 'nodeBack' : 'nodeDown';
		schedule(up ? 400 : 1000);
	}

	onDestroy(() => {
		if (loop) clearTimeout(loop);
		timers.forEach(clearTimeout);
	});
</script>

<div class="wrap">
	<!-- what you declare, and what actually runs -->
	<div class="top">
		<div class="declare">
			<span class="dlabel">{tx.youDeclare}</span>
			<div class="stepper">
				<button type="button" aria-label="minus" disabled={desired <= MIN} onclick={() => scale(-1)}
					>−</button
				>
				<b>{desired}</b>
				<button type="button" aria-label="plus" disabled={desired >= MAX} onclick={() => scale(1)}
					>+</button
				>
			</div>
			<span class="dlabel">{tx.replicasLabel}</span>
		</div>
		<span class="actual" class:ok={calm}>
			{tx.runningLabel.replace('{n}', String(running)).replace('{d}', String(desired))}
		</span>
	</div>

	<div class="plane" class:busy={!calm}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
			<path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<b>{tx.planeLabel}</b>
		<span>{planeText}</span>
	</div>

	<!-- the nodes, each one a machine with room for four pods -->
	<div class="nodes">
		{#each range(NODES) as n (n)}
			<div class="node" class:down={!nodeUp[n]}>
				<div class="nhead">
					<span class="led"></span>
					<span>{tx.nodeLabel.replace('{n}', String(n + 1))}</span>
				</div>
				<div class="slots">
					{#each pods.filter((p) => p.node === n) as p (p.id)}
						<button
							type="button"
							class="pod {p.status}"
							aria-label="pod"
							disabled={p.status !== 'running'}
							onclick={() => kill(p)}
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M12 3 4 7.5v9L12 21l8-4.5v-9Z"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linejoin="round"
								/>
								<path d="M4 7.5 12 12l8-4.5M12 12v9" stroke="currentColor" stroke-width="1.8" />
							</svg>
						</button>
					{/each}
					{#each range(Math.max(0, CAP - pods.filter((p) => p.node === n).length)) as i (i)}
						<span class="empty"></span>
					{/each}
				</div>
				{#if !nodeUp[n]}<span class="downtag">{tx.nodeDownTag}</span>{/if}
			</div>
		{/each}
	</div>

	{#if pending > 0}
		<div class="pending">
			{#each range(pending) as i (i)}
				<span class="pchip">{tx.pendingLabel}</span>
			{/each}
		</div>
	{/if}

	<div class="acts">
		<span class="hint">{tx.podHint}</span>
		<button type="button" class="line" class:warn={nodeUp[UNPLUG]} onclick={togglePlug}>
			{(nodeUp[UNPLUG] ? tx.unplugBtn : tx.plugBtn).replace('{n}', String(UNPLUG + 1))}
		</button>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.declare {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.dlabel {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.stepper {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.stepper button {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 16px;
		font-weight: 800;
	}
	.stepper button:disabled {
		opacity: 0.35;
	}
	.stepper b {
		min-width: 26px;
		text-align: center;
		font-size: 19px;
		color: var(--color-brand);
		font-variant-numeric: tabular-nums;
	}
	.actual {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 2px 10px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-amber);
		transition:
			background 0.3s ease,
			color 0.3s ease;
	}
	.actual.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	.plane {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
		font-size: 11.5px;
		color: var(--color-grass);
		transition: border-color 0.3s ease;
	}
	.plane b {
		color: var(--color-ink);
	}
	.plane span {
		margin-left: auto;
		font-weight: 700;
	}
	.plane.busy {
		border-color: var(--color-amber);
		color: var(--color-amber);
	}
	.plane.busy svg {
		animation: spin 1.2s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.nodes {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}
	.node {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
		transition: opacity 0.3s ease;
	}
	.node.down {
		opacity: 0.45;
		border-color: var(--color-danger);
	}
	.nhead {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.led {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.node.down .led {
		background: var(--color-danger);
	}
	.slots {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 5px;
	}
	.pod,
	.empty {
		display: flex;
		aspect-ratio: 1;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
	}
	.empty {
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		opacity: 0.6;
	}
	.pod {
		border: 1.5px solid var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			background 0.3s ease;
	}
	.pod.running:hover {
		transform: scale(1.06);
	}
	.pod.starting {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		color: var(--color-amber);
		cursor: default;
		animation: grow 0.8s ease both;
	}
	.pod.dying {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
		cursor: default;
		animation: fade 0.45s ease forwards;
	}
	@keyframes grow {
		from {
			transform: scale(0.4);
			opacity: 0.2;
		}
	}
	@keyframes fade {
		to {
			transform: scale(0.6);
			opacity: 0;
		}
	}
	.downtag {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 999px;
		background: var(--color-danger);
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 800;
		color: #fff;
	}
	.pending {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px;
	}
	.pchip {
		border-radius: 999px;
		border: 1px solid var(--color-amber);
		padding: 1px 8px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.acts {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
	}
	.hint {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.line {
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 8px 15px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.line.warn {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}

	@media (prefers-reduced-motion: reduce) {
		.plane.busy svg,
		.pod.starting,
		.pod.dying {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 14px;
		}
		.nhead {
			font-size: 11.5px;
		}
		.plane {
			font-size: 12.5px;
		}
	}
</style>
