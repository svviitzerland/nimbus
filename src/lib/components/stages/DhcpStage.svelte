<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DhcpText } from '$lib/chapters/network/dhcp/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DhcpText);

	type KeyState = 'free' | 'lent' | 'cooling';
	type Key = { ip: string; state: KeyState };
	type Guest = { id: number; kind: 'phone' | 'laptop'; ip: string };
	type Door = { id: number; kind: 'phone' | 'laptop'; denied: boolean };

	const keys = $state<Key[]>(
		[10, 11, 12, 13, 14, 15].map((n) => ({ ip: `192.168.1.${n}`, state: 'free' as KeyState }))
	);
	let seated = $state<Guest[]>([]);
	let door = $state<Door | null>(null);
	let step = $state(-1); // which DORA message is on the wire right now
	let offered = $state(''); // the key being offered to the newcomer
	let slipFor = $state<Guest | null>(null);
	let note = $state('');
	let count = 0;
	let firstJoin = true;
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const COOL_MS = 4000;
	const busy = $derived(step >= 0);

	function speed() {
		const r =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		return r ? 0.3 : 1;
	}
	function later(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms * speed()));
	}

	function arrive() {
		if (door || busy) return;
		count += 1;
		door = { id: count, kind: count % 2 ? 'phone' : 'laptop', denied: false };
		runDora();
	}

	function runDora() {
		if (!door) return;
		const d = door;
		const wasDenied = d.denied;
		d.denied = false;
		step = 0;
		note = tx.notes.asking;
		const key = keys.find((k) => k.state === 'free');
		if (!key) {
			later(1300, () => {
				step = -1;
				d.denied = true;
				note = tx.notes.empty;
				onstate?.('empty');
			});
			return;
		}
		later(750, () => {
			step = 1;
			offered = key.ip;
			key.state = 'lent';
		});
		later(1500, () => (step = 2));
		later(2250, () => (step = 3));
		later(3000, () => {
			const g: Guest = { id: d.id, kind: d.kind, ip: key.ip };
			seated.push(g);
			slipFor = g;
			door = null;
			step = -1;
			offered = '';
			note = wasDenied ? tx.notes.rejoin : tx.notes.joined;
			if (wasDenied) {
				onstate?.('rejoin');
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			} else if (firstJoin) {
				firstJoin = false;
				onstate?.('dora');
			}
		});
	}

	function leave(g: Guest) {
		if (busy) return;
		seated = seated.filter((s) => s.id !== g.id);
		if (slipFor?.id === g.id) slipFor = null;
		const key = keys.find((k) => k.ip === g.ip);
		if (!key) return;
		key.state = 'cooling';
		note = tx.notes.cooling;
		onstate?.('leave');
		later(COOL_MS, () => {
			key.state = 'free';
			if (door?.denied && !busy) runDora();
		});
	}

	const shown = $derived(note || tx.notes.idle);
	// Discover and Request travel up to the router, Offer and Ack come back down.
	const up = $derived(step === 0 || step === 2);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet keyIcon(color: string)}
	<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="4.5" stroke={color} stroke-width="2.6" />
		<path d="M11 11.5 20 20m-3.5.5V17" stroke={color} stroke-width="2.6" stroke-linecap="round" />
	</svg>
{/snippet}

<div class="wrap">
	<div class="btns">
		<CallToActionButton onclick={arrive} disabled={door !== null || busy}>
			{tx.arriveBtn}
		</CallToActionButton>
	</div>

	<!-- the router with its board of keys -->
	<div class="desk">
		<div class="router">
			<Device kind="router" size={50} tone={busy ? 'var(--color-amber)' : 'var(--color-grass)'} />
			<b>{tx.routerLabel}</b>
			<span>{tx.routerSub}</span>
		</div>
		<div class="board">
			<span class="blabel">{tx.boardLabel}</span>
			{#each keys as k (k.ip)}
				<div class="key {k.state}" class:offer={offered === k.ip}>
					{@render keyIcon(
						k.state === 'free'
							? 'var(--color-grass)'
							: k.state === 'cooling'
								? 'var(--color-amber)'
								: 'var(--color-faint)'
					)}
					<code>.{k.ip.split('.')[3]}</code>
					<span class="kstate"
						>{k.state === 'free'
							? tx.keyFree
							: k.state === 'lent'
								? tx.keyLent
								: tx.keyCooling}</span
					>
					{#if k.state === 'cooling'}
						<span class="cool" style="animation-duration:{COOL_MS * speed()}ms"></span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- DORA, four messages between the newcomer and the router -->
	<div class="dora" class:live={busy}>
		{#each tx.steps as s, i (i)}
			<div class="pill" class:on={step === i} class:past={busy && step > i}>
				<span class="arrow" class:down={i % 2 === 1}>
					<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
						<path
							d="M5 8.5V1.5M2 4.5l3-3 3 3"
							stroke="currentColor"
							stroke-width="1.6"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
				<b>{s.name}</b>
			</div>
		{/each}
	</div>
	<p class="say">
		{#if busy}
			<span class="sayin" class:up>{tx.steps[step].say}</span>
			{#if step >= 1 && offered}<code>{offered}</code>{/if}
		{:else}
			&nbsp;
		{/if}
	</p>

	<!-- the door, where a newcomer stands while asking -->
	<div class="door" class:filled={door !== null}>
		<span class="dlabel">{tx.doorLabel}</span>
		{#if door}
			<div class="newbie" class:denied={door.denied}>
				<Device
					kind={door.kind}
					size={30}
					tone={door.denied ? 'var(--color-danger)' : 'var(--color-amber)'}
				/>
				<span>{tx.guestLabel.replace('{n}', String(door.id))}</span>
				{#if door.denied}<em>{tx.noAddress}</em>{/if}
			</div>
		{/if}
	</div>

	<!-- the seats inside the cafe, tap one to send that customer home -->
	<div class="seats">
		{#each { length: 6 }, i (i)}
			{@const g = seated[i]}
			{#if g}
				<button
					type="button"
					class="seat taken"
					class:picked={slipFor?.id === g.id}
					onclick={() => leave(g)}
					disabled={busy}
				>
					<Device kind={g.kind} size={26} tone="var(--color-grass)" />
					<span class="gname">{tx.guestLabel.replace('{n}', String(g.id))}</span>
					<code>{g.ip}</code>
				</button>
			{:else}
				<span class="seat"></span>
			{/if}
		{/each}
	</div>
	<p class="hint">{seated.length ? tx.tapToLeave : ' '}</p>

	<p class="note">{shown}</p>

	{#if slipFor}
		<div class="slip">
			<b>{tx.slipTitle.replace('{n}', String(slipFor.id))}</b>
			<div><span>{tx.slip.address}</span><code>{slipFor.ip}</code></div>
			<div><span>{tx.slip.gateway}</span><code>192.168.1.1</code></div>
			<div><span>{tx.slip.dns}</span><code>192.168.1.1</code></div>
			<div><span>{tx.slip.lease}</span><code>{tx.slip.leaseValue}</code></div>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 12px;
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.btns {
		display: flex;
		min-height: 46px;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}

	.desk {
		display: flex;
		width: min(94vw, 380px);
		align-items: center;
		gap: 12px;
	}
	.router {
		display: flex;
		width: 92px;
		flex: none;
		flex-direction: column;
		align-items: center;
		line-height: 1.2;
	}
	.router b {
		margin-top: 2px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.router span {
		font-size: 9px;
		color: var(--color-faint);
	}
	.board {
		display: grid;
		flex: 1;
		grid-template-columns: repeat(3, 1fr);
		gap: 5px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
	}
	.blabel {
		grid-column: 1 / -1;
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.key {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		overflow: hidden;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-grass-soft);
		padding: 4px 2px 5px;
		transition:
			background 0.3s,
			transform 0.3s;
	}
	.key code {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.kstate {
		font-size: 8px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.key.lent {
		background: var(--color-paper);
	}
	.key.lent code {
		color: var(--color-faint);
	}
	.key.cooling {
		background: var(--color-amber-soft);
	}
	.key.offer {
		transform: scale(1.08);
		border-color: var(--color-amber);
	}
	.cool {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 3px;
		width: 100%;
		background: var(--color-amber);
		transform-origin: left;
		animation: drain linear forwards;
	}
	@keyframes drain {
		to {
			transform: scaleX(0);
		}
	}

	.dora {
		display: grid;
		width: min(94vw, 360px);
		grid-template-columns: repeat(4, 1fr);
		gap: 5px;
		opacity: 0.55;
		transition: opacity 0.3s;
	}
	.dora.live {
		opacity: 1;
	}
	.pill {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 2px;
		font-size: 10px;
		color: var(--color-faint);
		transition:
			background 0.25s,
			color 0.25s,
			border-color 0.25s;
	}
	.pill b {
		font-weight: 800;
	}
	.pill.past {
		color: var(--color-grass);
		border-color: var(--color-grass);
	}
	.pill.on {
		background: var(--color-amber);
		border-color: var(--color-amber);
		color: #fff;
	}
	.arrow {
		display: inline-flex;
	}
	.arrow.down {
		transform: rotate(180deg);
	}
	.say {
		display: flex;
		min-height: 22px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.sayin {
		animation: rise 0.3s ease;
	}
	.say code {
		border-radius: 6px;
		background: var(--color-amber-soft);
		padding: 1px 6px;
		font-size: 11px;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	.sayin.up {
		animation-name: fall;
	}
	@keyframes fall {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}

	.door {
		display: flex;
		width: min(94vw, 360px);
		min-height: 62px;
		align-items: center;
		gap: 10px;
		border-radius: 14px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 6px 12px;
	}
	.door.filled {
		border-color: var(--color-amber);
	}
	.dlabel {
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.newbie {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		animation: rise 0.35s ease;
	}
	.newbie em {
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		padding: 2px 8px;
		font-size: 9.5px;
		font-style: normal;
		font-weight: 800;
	}

	.seats {
		display: grid;
		width: min(94vw, 360px);
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.seat {
		display: flex;
		min-height: 66px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.seat.taken {
		background: var(--color-card);
		cursor: pointer;
		animation: rise 0.35s ease;
		transition: border-color 0.2s;
	}
	.seat.taken:enabled:hover {
		border-color: var(--color-danger);
	}
	.seat.picked {
		border-color: var(--color-grass);
	}
	.gname {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.seat code {
		font-size: 9.5px;
		color: var(--color-ink);
	}
	.hint {
		min-height: 1.2em;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.slip {
		display: flex;
		width: min(94vw, 260px);
		flex-direction: column;
		gap: 2px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
	}
	.slip b {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.slip div {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
	}
	.slip span {
		font-weight: 700;
		color: var(--color-muted);
	}
	.slip code {
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.sayin,
		.newbie,
		.seat.taken {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.desk,
		.dora,
		.door,
		.seats {
			width: 440px;
		}
		.pill {
			font-size: 11.5px;
		}
		.say,
		.note {
			font-size: 14px;
		}
		.note {
			max-width: 460px;
		}
	}
</style>
