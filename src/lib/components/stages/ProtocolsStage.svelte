<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ProtocolsText } from '$lib/chapters/network/protocols/types';
	import MiniLaptop from './delivery/MiniLaptop.svelte';
	import Server from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ProtocolsText);

	// The doors on the server, one per distinct port, in ascending order.
	const doors = $derived([...new Set(tx.protocols.map((p) => p.port))].sort((a, b) => a - b));
	// Which protocols wait behind each door (SFTP and SSH share 22).
	const doorNames = (port: number) =>
		tx.protocols
			.filter((p) => p.port === port)
			.map((p) => p.name)
			.join(' ');
	const doorX = (port: number) => ((doors.indexOf(port) + 0.5) / doors.length) * 100;

	let idx = $state(0);
	let busy = $state(false);
	let flying = $state<{ name: string; port: number; kind: 'ok' | 'close' | 'wrong' } | null>(null);
	let landed = $state(false);
	let outcome = $state<'' | 'ok' | 'close' | 'wrong'>('');
	let lastPick = $state('');
	let shot = $state(0); // remounts the flying packet for every pick
	let finished = $state(false);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
	const reduce = () =>
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	const task = $derived(tx.tasks[Math.min(idx, tx.tasks.length - 1)]);

	function pick(pid: string) {
		if (busy || finished) return;
		const p = tx.protocols.find((x) => x.id === pid);
		if (!p) return;
		busy = true;
		outcome = '';
		landed = false;
		lastPick = p.name;
		shot += 1;
		const kind = pid === task.answer ? 'ok' : pid === task.close ? 'close' : 'wrong';
		flying = { name: p.name, port: p.port, kind };
		const fly = reduce() ? 50 : 750;
		// one frame later so the transition from the laptop runs
		later(() => (landed = true), 30);
		later(() => {
			outcome = kind;
			busy = kind === 'ok';
			if (kind === 'ok') {
				const last = idx === tx.tasks.length - 1;
				if (last) {
					onstate?.('done');
					if (!completed) {
						completed = true;
						oncomplete?.();
					}
				} else onstate?.(pid);
				later(
					() => {
						flying = null;
						landed = false;
						outcome = '';
						busy = false;
						if (last) finished = true;
						else idx += 1;
					},
					reduce() ? 300 : 1300
				);
			} else {
				onstate?.(kind === 'close' ? pid : 'wrong');
			}
		}, fly + 60);
	}

	function again() {
		timers.forEach(clearTimeout);
		timers = [];
		idx = 0;
		finished = false;
		flying = null;
		landed = false;
		outcome = '';
		busy = false;
	}

	const note = $derived(
		outcome === 'wrong' ? task.hint : outcome === 'close' ? task.hint : finished ? tx.doneNote : ' '
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="taskcard" class:fin={finished}>
		<div class="dots" aria-hidden="true">
			{#each tx.tasks as _, i (i)}
				<span class:done={i < idx || finished} class:cur={i === idx && !finished}></span>
			{/each}
		</div>
		{#if finished}
			<b class="tt">{tx.doneNote}</b>
			<button type="button" class="again" onclick={again}>{tx.againBtn}</button>
		{:else}
			<span class="tl"
				>{tx.taskLabel
					.replace('{n}', String(idx + 1))
					.replace('{total}', String(tx.tasks.length))}</span
			>
			<b class="tt">{task.text}</b>
		{/if}
	</div>

	{#if !finished}
		<div class="pickwrap">
			<span class="pl">{tx.pickLabel}</span>
			<div class="chips">
				{#each tx.protocols as p (p.id)}
					<button
						type="button"
						class="chip"
						class:bad={outcome === 'wrong' && lastPick === p.name}
						class:meh={outcome === 'close' && lastPick === p.name}
						onclick={() => pick(p.id)}
						disabled={busy}
					>
						<b>{p.name}</b><span>{p.port}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="scene">
		<div class="lap">
			<MiniLaptop label={tx.laptopLabel} led={outcome === 'ok' ? 'ok' : 'off'} />
		</div>

		{#if flying}
			{#key shot}
				<span
					class="pkt {flying.kind}"
					class:landed
					class:bounce={landed && (outcome === 'wrong' || outcome === 'close')}
					style="--tx:{doorX(flying.port)}%"
				>
					{flying.name}
					{flying.port}
				</span>
			{/key}
		{/if}

		<div class="building">
			<div class="bhead">
				<Server slots={2} active={outcome === 'ok'} />
				<div>
					<b>{tx.serverLabel}</b>
					<span>{tx.doorsLabel}</span>
				</div>
			</div>
			<div class="doors" style="grid-template-columns:repeat({doors.length}, 1fr)">
				{#each doors as d (d)}
					<div
						class="door"
						class:ok={flying?.port === d && outcome === 'ok'}
						class:meh={flying?.port === d && outcome === 'close'}
						class:bad={flying?.port === d && outcome === 'wrong'}
					>
						<b>{d}</b>
						<span>{doorNames(d)}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<p class="note" class:warn={outcome === 'close'} class:bad={outcome === 'wrong'}>{note}</p>
</div>

<style>
	.taskcard {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: min(94vw, 340px);
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 14px 11px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
		text-align: center;
	}
	.taskcard.fin {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.dots {
		display: flex;
		gap: 5px;
	}
	.dots span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.25s ease;
	}
	.dots span.done {
		background: var(--color-grass);
	}
	.dots span.cur {
		background: var(--color-brand);
	}
	.tl {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.tt {
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.again {
		margin-top: 2px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 5px 12px;
		font-size: 12px;
		font-weight: 600;
	}
	.pickwrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.pl {
		font-size: 11px;
		color: var(--color-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		max-width: min(94vw, 360px);
	}
	.chip {
		display: inline-flex;
		align-items: baseline;
		gap: 5px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 10px;
		font-size: 12px;
		transition:
			border-color 0.2s ease,
			transform 0.15s ease;
	}
	.chip span {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.chip:enabled:hover {
		border-color: var(--color-ink);
		transform: translateY(-1px);
	}
	.chip:disabled {
		opacity: 0.55;
	}
	.chip.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.chip.meh {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}

	.scene {
		position: relative;
		width: min(94vw, 340px);
		height: 210px;
	}
	.lap {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.pkt {
		position: absolute;
		z-index: 3;
		left: 50%;
		top: 52px;
		transform: translate(-50%, 0);
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-size: 10px;
		font-weight: 800;
		padding: 3px 9px;
		white-space: nowrap;
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.18);
		transition:
			left 0.7s ease-in-out,
			top 0.7s ease-in-out;
	}
	.pkt.landed {
		left: var(--tx);
		top: calc(100% - 68px);
	}
	.pkt.landed.ok {
		background: var(--color-grass);
	}
	.pkt.bounce.close {
		background: var(--color-amber);
	}
	.pkt.bounce.wrong {
		background: var(--color-danger);
		animation: shake 0.35s ease 1;
	}
	@keyframes shake {
		25% {
			translate: -4px 0;
		}
		75% {
			translate: 4px 0;
		}
	}
	.building {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 8px 9px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.bhead {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.bhead :global(.server) {
		width: 38px;
		gap: 3px;
		padding: 4px;
		border-radius: 7px;
		box-shadow: none;
	}
	.bhead :global(.server .slot) {
		height: 7px;
		padding: 0 3px;
	}
	.bhead :global(.server .dot) {
		width: 4px;
		height: 4px;
	}
	.bhead div {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}
	.bhead b {
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.bhead span {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.doors {
		display: grid;
		gap: 5px;
	}
	.door {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 8px 8px 4px 4px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		padding: 5px 2px;
		line-height: 1.15;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.door b {
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.door span {
		font-size: 8px;
		font-weight: 700;
		color: var(--color-faint);
		text-align: center;
	}
	.door.ok {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.door.meh {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.door.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.note.warn {
		color: var(--color-amber);
	}
	.note.bad {
		color: var(--color-danger);
	}
	:global(.dark) .taskcard,
	:global(.dark) .building {
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.pkt {
			transition: none;
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.taskcard,
		.scene {
			width: 440px;
		}
		.chips {
			max-width: 460px;
		}
		.tt {
			font-size: 16px;
		}
		.chip {
			font-size: 13.5px;
		}
		.note {
			font-size: 14px;
			max-width: 440px;
		}
		.door span {
			font-size: 9.5px;
		}
	}
</style>
