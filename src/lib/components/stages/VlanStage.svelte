<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { VlanText } from '$lib/chapters/network/vlan/types';
	import MiniLaptop from './delivery/MiniLaptop.svelte';
	import MiniServer from './delivery/MiniServer.svelte';
	import MiniPhone from './delivery/MiniPhone.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as VlanText);

	// VLAN ids and the palette token each one is painted with.
	const VLANS = [1, 10, 20];
	const COLOR: Record<number, string> = {
		1: 'var(--color-faint)',
		10: 'var(--color-brand)',
		20: 'var(--color-amber)'
	};
	// Devices 0..2 are finance (top row), 3..5 are guests (bottom row).
	// Like a real switch, odd ports sit on the top row and even ports on the bottom row.
	const portOf = (d: number) => (d < 3 ? d * 2 + 1 : (d - 3) * 2 + 2);
	const isFinance = (d: number) => d < 3;

	let vlan = $state<number[]>([1, 1, 1, 1, 1, 1]); // per device, i.e. per port it uses
	let picked = $state<number | null>(null);
	let result = $state<{ a: number; b: number; ok: boolean } | null>(null);
	let splitSaid = false;
	let gotReach = false;
	let gotBlocked = false;
	let done = $state(false);

	const satisfied = $derived(
		vlan[0] === vlan[1] &&
			vlan[1] === vlan[2] &&
			vlan[3] === vlan[4] &&
			vlan[4] === vlan[5] &&
			vlan[0] !== vlan[3]
	);

	function cyclePort(d: number) {
		const next = VLANS[(VLANS.indexOf(vlan[d]) + 1) % VLANS.length];
		vlan[d] = next;
		result = null;
		if (!satisfied) {
			gotReach = false;
			gotBlocked = false;
		} else if (!splitSaid) {
			splitSaid = true;
			onstate?.('split');
		}
	}

	function tap(d: number) {
		if (picked === null) {
			picked = d;
			result = null;
			return;
		}
		if (picked === d) {
			picked = null;
			return;
		}
		const a = picked;
		picked = null;
		const same = vlan[a] === vlan[d];
		const cross = isFinance(a) !== isFinance(d);
		result = { a, b: d, ok: same };
		let token = same ? (cross ? 'leak' : 'reach') : cross ? 'blocked' : 'oops';
		if (satisfied) {
			if (token === 'reach') gotReach = true;
			if (token === 'blocked') gotBlocked = true;
			if (gotReach && gotBlocked && !done) {
				done = true;
				token = 'done';
				oncomplete?.();
			}
		}
		onstate?.(token);
	}

	function reset() {
		vlan = [1, 1, 1, 1, 1, 1];
		picked = null;
		result = null;
		gotReach = false;
		gotBlocked = false;
	}

	const hint = $derived(
		picked !== null ? tx.pickTarget.replace('{name}', tx.devices[picked]) : tx.pingHint
	);
	const vlanName = (v: number) => tx.vlans[VLANS.indexOf(v)];
	const lit = (d: number) => result && (result.a === d || result.b === d);
</script>

{#snippet device(d: number)}
	<button
		type="button"
		class="dev"
		class:picked={picked === d}
		class:ok={lit(d) && result?.ok}
		class:no={lit(d) && !result?.ok}
		onclick={() => tap(d)}
	>
		{#if d === 2}
			<MiniServer label={tx.devices[d]} active={!!(lit(d) && result?.ok)} />
		{:else if d === 3 || d === 5}
			<MiniPhone label={tx.devices[d]} />
		{:else}
			<MiniLaptop label={tx.devices[d]} led={lit(d) ? (result?.ok ? 'ok' : 'down') : 'off'} />
		{/if}
		<span class="vchip" style="--c:{COLOR[vlan[d]]}">{vlan[d]}</span>
	</button>
{/snippet}

{#snippet port(d: number)}
	<button
		type="button"
		class="port"
		style="--c:{COLOR[vlan[d]]}"
		aria-label={tx.portAria.replace('{n}', String(portOf(d))).replace('{vlan}', vlanName(vlan[d]))}
		onclick={() => cyclePort(d)}>{portOf(d)}</button
	>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="goal" class:solved={done}>
		<div>
			<b>{tx.goalTitle}</b>
			<span>{done ? tx.solvedNote : tx.goal}</span>
		</div>
		<button type="button" class="reset" onclick={reset}>{tx.resetBtn}</button>
	</div>

	<div class="rig">
		<span class="grp">{tx.financeTag}</span>
		<div class="row">
			{#each [0, 1, 2] as d (d)}
				<div class="col">
					{@render device(d)}<span class="cable" style="--c:{COLOR[vlan[d]]}"></span>
				</div>
			{/each}
		</div>

		<div class="switch">
			<div class="ports">
				{#each [0, 1, 2] as d (d)}{@render port(d)}{/each}
			</div>
			<span class="swlabel">{tx.switchLabel}</span>
			<div class="ports">
				{#each [3, 4, 5] as d (d)}{@render port(d)}{/each}
			</div>
		</div>

		<div class="row">
			{#each [3, 4, 5] as d (d)}
				<div class="col">
					<span class="cable" style="--c:{COLOR[vlan[d]]}"></span>{@render device(d)}
				</div>
			{/each}
		</div>
		<span class="grp">{tx.guestTag}</span>
	</div>

	<div class="legend">
		{#each VLANS as v (v)}
			<span><i style="background:{COLOR[v]}"></i>{vlanName(v)}</span>
		{/each}
	</div>

	{#if result}
		<p class="res" class:no={!result.ok}>
			{(result.ok ? tx.reachOk : tx.reachNo)
				.replace('{a}', tx.devices[result.a])
				.replace('{b}', tx.devices[result.b])}
		</p>
	{:else}
		<p class="note">{hint}<br /><span class="sub">{tx.portHint}</span></p>
	{/if}
</div>

<style>
	.goal {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		width: min(94vw, 340px);
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.goal div {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.goal b {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.goal.solved {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.goal.solved b {
		color: var(--color-grass);
	}
	.reset {
		flex: none;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 5px 10px;
		font-size: 11px;
		font-weight: 600;
	}
	.reset:hover {
		border-color: var(--color-ink);
	}

	.rig {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(94vw, 330px);
	}
	.grp {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 2px 0;
	}
	.row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		width: 100%;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.cable {
		width: 3px;
		height: 14px;
		border-radius: 2px;
		background: var(--c);
		transition: background 0.25s ease;
	}
	.dev {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		border: 1.5px solid transparent;
		padding: 4px 6px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.dev:hover {
		border-color: var(--color-line);
	}
	.dev.picked {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.dev.ok {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.dev.no {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.vchip {
		position: absolute;
		top: 2px;
		right: 2px;
		min-width: 18px;
		border-radius: 999px;
		background: var(--c);
		color: #fff;
		font-size: 8.5px;
		font-weight: 800;
		padding: 1px 4px;
		transition: background 0.25s ease;
	}
	.switch {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 4px;
		width: 100%;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 0;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
	}
	.ports {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-items: center;
	}
	.port {
		width: 30px;
		height: 24px;
		border-radius: 5px;
		border: 2px solid var(--c);
		background: color-mix(in srgb, var(--c) 18%, var(--color-card));
		color: var(--color-ink);
		font-size: 10.5px;
		font-weight: 800;
		transition:
			border-color 0.25s ease,
			background 0.25s ease,
			transform 0.15s ease;
	}
	.port:hover {
		transform: scale(1.1);
	}
	.swlabel {
		text-align: center;
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 12px;
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.legend i {
		width: 9px;
		height: 9px;
		border-radius: 3px;
	}
	.note,
	.res {
		min-height: 2.6em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.note .sub {
		font-weight: 500;
		color: var(--color-faint);
	}
	.res {
		color: var(--color-grass);
	}
	.res.no {
		color: var(--color-danger);
	}
	:global(.dark) .switch {
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.port,
		.dev,
		.cable {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.goal,
		.rig {
			width: 440px;
		}
		.goal,
		.note,
		.res {
			font-size: 14px;
		}
		.note,
		.res {
			max-width: 440px;
		}
		.port {
			width: 36px;
			height: 28px;
			font-size: 12px;
		}
		.legend {
			font-size: 12px;
		}
	}
</style>
