<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { IpAddressText } from '$lib/chapters/network/ip-address/types';
	import DeviceIcon from './netbasics/DeviceIcon.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IpAddressText);

	type Dev = 'phone' | 'laptop' | 'router';
	let seen = $state<Record<Dev, boolean>>({ phone: false, laptop: false, router: false });
	const allSeen = $derived(seen.phone && seen.laptop && seen.router);

	function reveal(d: Dev) {
		if (!seen[d]) seen[d] = true;
		onstate?.(d);
	}

	// ---- Act two, a stranger out on the internet knocks on an address ----
	type Target = 'phone' | 'laptop' | 'routerIn' | 'routerOut';
	const TARGETS: Target[] = ['phone', 'laptop', 'routerIn', 'routerOut'];
	let knock = $state<{ t: Target; n: number } | null>(null);
	let landed = $state(false);
	let tried = { lost: false, public: false };
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let n = 0;

	function send(t: Target) {
		timers.forEach(clearTimeout);
		timers = [];
		landed = false;
		knock = { t, n: ++n };
		const hit = t === 'routerOut';
		timers.push(
			setTimeout(() => {
				landed = true;
				const token = hit ? 'public' : 'lost';
				onstate?.(token);
				tried[token] = true;
				if (tried.lost && tried.public && !done) {
					done = true;
					oncomplete?.();
				}
			}, 1000)
		);
	}

	const note = $derived(
		!allSeen
			? tx.tapHint
			: knock && landed
				? (knock.t === 'routerOut' ? tx.hitNote : tx.lostNote).replace('{ip}', tx.ips[knock.t])
				: tx.knockPrompt
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center gap-3">
	<!-- the actions sit up top, clear of Nim in the corner -->
	<div class="knocks" class:off={!allSeen} aria-hidden={!allSeen}>
		<span class="klabel">{tx.knockLabel}</span>
		<div class="kgrid">
			{#each TARGETS as t (t)}
				<button
					type="button"
					class="kbtn"
					class:pub={t === 'routerOut'}
					class:on={knock?.t === t}
					disabled={!allSeen}
					onclick={() => send(t)}>{tx.ips[t]}</button
				>
			{/each}
		</div>
	</div>

	<div class="scene">
		<!-- out on the internet -->
		<div class="net">
			<span class="zlabel">{tx.internetLabel}</span>
			<div class="stranger">
				<span class="ink"><DeviceIcon kind="person" size={26} /></span>
				<span class="slabel">{tx.strangerLabel}</span>
			</div>
		</div>

		<!-- the home network, the router sits in its wall -->
		<div class="house">
			<span class="hlabel">{tx.houseLabel}</span>

			<button
				type="button"
				class="dev router"
				class:seen={seen.router}
				class:hit={landed && knock?.t === 'routerOut'}
				onclick={() => reveal('router')}
			>
				<span class="chip pub" class:show={seen.router}>
					<i>{tx.outsideTag}</i>{tx.ips.routerOut}
				</span>
				<span class="icon"><DeviceIcon kind="router" size={34} /></span>
				<span class="dlabel">{tx.routerLabel}</span>
				<span class="chip" class:show={seen.router}>
					<i>{tx.insideTag}</i>{tx.ips.routerIn}
				</span>
			</button>

			<div class="row">
				<button type="button" class="dev" class:seen={seen.phone} onclick={() => reveal('phone')}>
					<span class="icon"><DeviceIcon kind="phone" size={32} /></span>
					<span class="dlabel">{tx.phoneLabel}</span>
					<span class="chip" class:show={seen.phone}>{tx.ips.phone}</span>
				</button>
				<button type="button" class="dev" class:seen={seen.laptop} onclick={() => reveal('laptop')}>
					<span class="icon"><DeviceIcon kind="laptop" size={34} /></span>
					<span class="dlabel">{tx.laptopLabel}</span>
					<span class="chip" class:show={seen.laptop}>{tx.ips.laptop}</span>
				</button>
			</div>
			<span class="legend">
				<span class="dot"></span>{tx.privateTag}
				<span class="dot pubdot"></span>{tx.publicTag}
			</span>
		</div>

		<!-- the knock itself -->
		{#if knock}
			{#key knock.n}
				<span
					class="packet"
					class:lost={knock.t !== 'routerOut'}
					class:hitp={knock.t === 'routerOut'}
				></span>
				{#if landed}
					<span class="ktag" class:hittag={knock.t === 'routerOut'}
						>{knock.t === 'routerOut' ? tx.hitTag : tx.lostTag}</span
					>
				{/if}
			{/key}
		{/if}
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.knocks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		transition: opacity 0.3s ease;
	}
	.knocks.off {
		opacity: 0;
		pointer-events: none;
	}
	.klabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.kgrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
	}
	.kbtn {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 7px 12px;
		font-size: 12px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		transition: border-color 0.2s ease;
	}
	.kbtn:enabled:hover,
	.kbtn.on {
		border-color: var(--color-ink);
	}
	.kbtn.pub {
		color: var(--color-brand);
	}

	.scene {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(94vw, 360px);
	}
	.net {
		position: relative;
		width: 100%;
		height: 70px;
		border-radius: 16px;
		background: var(--color-brand-soft);
	}
	.zlabel {
		position: absolute;
		top: 8px;
		right: 12px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-brand);
	}
	.stranger {
		position: absolute;
		top: 12px;
		left: 12%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.ink {
		color: var(--color-ink);
		line-height: 0;
	}
	.slabel {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}

	.house {
		position: relative;
		margin-top: 54px;
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		border-radius: 18px;
		border: 2px solid var(--color-line);
		background: var(--color-card);
		padding: 0 12px 12px;
	}
	.hlabel {
		position: absolute;
		top: 8px;
		left: 12px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.dev {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 14px;
		border: 1px solid transparent;
		padding: 6px 8px;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			box-shadow 0.3s ease;
	}
	.dev:hover {
		border-color: var(--color-line);
	}
	.dev.seen {
		color: var(--color-ink);
	}
	.icon {
		line-height: 0;
	}
	.dlabel {
		font-size: 11px;
		font-weight: 700;
	}
	/* the router straddles the wall of the house, half outside and half inside */
	.router {
		margin-top: -44px;
		background: var(--color-card);
		border-color: var(--color-line);
	}
	.router.hit {
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		opacity: 0;
		transform: scale(0.8);
		transition:
			opacity 0.25s ease,
			transform 0.25s ease;
	}
	.chip.show {
		opacity: 1;
		transform: none;
	}
	.chip.pub {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip i {
		font-style: normal;
		font-size: 9px;
		font-weight: 700;
		opacity: 0.75;
	}
	.row {
		display: flex;
		justify-content: center;
		gap: 36px;
	}
	.legend {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.dot.pubdot {
		margin-left: 8px;
		background: var(--color-brand);
	}

	.packet {
		position: absolute;
		top: 30px;
		left: 15%;
		width: 12px;
		height: 12px;
		margin-left: -6px;
		border-radius: 50%;
		background: var(--color-amber);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-amber) 25%, transparent);
		z-index: 3;
		pointer-events: none;
	}
	.packet.lost {
		animation: lost 1.1s ease-out forwards;
	}
	.packet.hitp {
		animation: hit 1s ease-in-out forwards;
	}
	@keyframes lost {
		0% {
			left: 15%;
			top: 30px;
		}
		85% {
			left: 54%;
			top: 44px;
			opacity: 1;
		}
		100% {
			left: 58%;
			top: 44px;
			opacity: 0;
		}
	}
	@keyframes hit {
		0% {
			left: 15%;
			top: 30px;
		}
		100% {
			left: 50%;
			top: 86px;
		}
	}
	.ktag {
		position: absolute;
		top: 36px;
		left: 62%;
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		color: var(--color-muted);
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 800;
		white-space: nowrap;
		z-index: 4;
		animation: pop 0.25s ease;
	}
	.ktag.hittag {
		top: 78px;
		left: auto;
		right: 4%;
		border-color: transparent;
		background: var(--color-brand);
		color: #fff;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
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

	@media (prefers-reduced-motion: reduce) {
		.packet.lost,
		.packet.hitp,
		.ktag {
			animation-duration: 0.01s;
		}
		.chip {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 440px;
		}
		.kbtn {
			font-size: 13px;
			padding: 8px 16px;
		}
		.dlabel {
			font-size: 12.5px;
		}
		.chip {
			font-size: 12px;
		}
		.row {
			gap: 64px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
