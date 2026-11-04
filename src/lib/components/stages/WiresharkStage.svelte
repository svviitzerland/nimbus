<script lang="ts">
	// Guided Wireshark lesson. A laptop loads nimbus.com while packets fly in and out, then its
	// screen turns into a capture that fills up by itself, and one packet is unwrapped below it
	// like a parcel inside a parcel. On the last beat the learner may tap any row to unwrap it.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WiresharkText } from '$lib/chapters/network/wireshark/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WiresharkText);

	const STEP_OF_BEAT = [0, 1, 2, 3, 4, 4, 4];
	const last = $derived(beat >= tx.intro.length - 1);
	let peek = $state<number | null>(null);
	let picked = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const beatStep = $derived(STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)]);
	const step = $derived(peek ?? beatStep);

	// The nine packets of one page load (real looking protocol data, not copy)
	type Kind = 'dns' | 'tcp' | 'hello' | 'data';
	const ME = '192.168.1.23';
	const PACKETS: { proto: string; info: string; kind: Kind; ip: string; port: string }[] = [
		{
			proto: 'DNS',
			info: 'Standard query A nimbus.com',
			kind: 'dns',
			ip: `${ME} → 192.168.1.1`,
			port: 'UDP 53'
		},
		{
			proto: 'DNS',
			info: 'Standard query response A 76.76.21.21',
			kind: 'dns',
			ip: `192.168.1.1 → ${ME}`,
			port: 'UDP 53'
		},
		{
			proto: 'TCP',
			info: '51234 → 443 [SYN]',
			kind: 'tcp',
			ip: `${ME} → 76.76.21.21`,
			port: 'TCP 443'
		},
		{
			proto: 'TCP',
			info: '443 → 51234 [SYN, ACK]',
			kind: 'tcp',
			ip: `76.76.21.21 → ${ME}`,
			port: 'TCP 443'
		},
		{
			proto: 'TCP',
			info: '51234 → 443 [ACK]',
			kind: 'tcp',
			ip: `${ME} → 76.76.21.21`,
			port: 'TCP 443'
		},
		{
			proto: 'TLS',
			info: 'Client Hello (nimbus.com)',
			kind: 'hello',
			ip: `${ME} → 76.76.21.21`,
			port: 'TCP 443'
		},
		{
			proto: 'TLS',
			info: 'Server Hello, Certificate',
			kind: 'hello',
			ip: `76.76.21.21 → ${ME}`,
			port: 'TCP 443'
		},
		{
			proto: 'TLS',
			info: 'Application Data',
			kind: 'data',
			ip: `${ME} → 76.76.21.21`,
			port: 'TCP 443'
		},
		{
			proto: 'TLS',
			info: 'Application Data',
			kind: 'data',
			ip: `76.76.21.21 → ${ME}`,
			port: 'TCP 443'
		}
	];
	const MAC = (i: number) =>
		PACKETS[i].ip.startsWith(ME) ? 'a4:83:e7 → 3c:22:fb' : '3c:22:fb → a4:83:e7';

	// rows fill in by themselves when the capture starts
	let count = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;
	$effect(() => {
		const capturing = step >= 1;
		clearInterval(timer);
		if (!capturing) {
			count = 0;
			return;
		}
		const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduced || step >= 2) {
			count = PACKETS.length;
			return;
		}
		count = 0;
		timer = setInterval(() => {
			count += 1;
			if (count >= PACKETS.length) clearInterval(timer);
		}, 420);
		return () => clearInterval(timer);
	});

	// which packet is unwrapped below the laptop
	const open = $derived(
		last && picked !== null && peek === null ? picked : step === 2 ? 0 : step >= 3 ? 7 : null
	);

	const steps = $derived(
		last && picked !== null
			? [
					...tx.steps,
					{
						tag: PACKETS[picked].proto,
						title: tx.packetTitle.replace('{n}', String(picked + 1)),
						body: tx.packetNotes[picked]
					}
				]
			: tx.steps
	);
	const active = $derived(last && picked !== null && peek === null ? tx.steps.length : step);

	function pick(i: number) {
		if (!last) return;
		picked = i;
		peek = null;
		onstate?.(PACKETS[i].kind);
	}

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
	});
</script>

{#snippet scene(_: number)}
	<div class="flex w-full max-w-[440px] flex-col items-center gap-3">
		<div class="laptop">
			<div class="lid">
				<div class="screen">
					{#if step === 0}
						<div class="browser">
							<div class="addr"><span class="lockico"></span>nimbus.com</div>
							<div class="page">
								<i class="w60"></i><i class="w90"></i><i class="w75"></i>
								<div class="cards"><i></i><i></i></div>
							</div>
						</div>
					{:else}
						<div class="ws">
							<div class="wsbar"><span class="rec"></span>{tx.capturing}</div>
							<div class="row head">
								<span class="no">{tx.colNo}</span><span class="pr">{tx.colProto}</span><span
									class="inf">{tx.colInfo}</span
								>
							</div>
							{#each PACKETS.slice(0, count) as p, i (i)}
								<button
									type="button"
									class="row {p.kind}"
									class:sel={open === i}
									class:tap={last}
									tabindex={last ? 0 : -1}
									onclick={() => pick(i)}
								>
									<span class="no">{i + 1}</span><span class="pr">{p.proto}</span><span class="inf"
										>{p.info}</span
									>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
			<div class="base"></div>
			{#if step === 0}
				<div class="fly" aria-hidden="true">
					{#each [0, 1, 2, 3] as k (k)}
						<span class="env" class:back={k % 2 === 1} style="animation-delay:{k * 0.55}s"></span>
					{/each}
				</div>
			{/if}
		</div>

		{#if open !== null}
			{@const p = PACKETS[open]}
			{@const content = tx.contents[open]}
			<div class="parcel">
				<div class="wrap l2">
					<div class="lh"><span>{tx.layerNames.frame}</span><code>{MAC(open)}</code></div>
					<div class="wrap l3">
						<div class="lh"><span>{tx.layerNames.ip}</span><code>{p.ip}</code></div>
						<div class="wrap l4">
							<div class="lh"><span>{tx.layerNames.port}</span><code>{p.port}</code></div>
							<div class="wrap core" class:locked={!content}>
								<div class="lh">
									<span>{tx.layerNames.content}</span>
									{#if content}
										<code>{content}</code>
									{:else}
										<code class="noise"
											><span class="lockico dark"></span>{tx.lockedLabel} 7f3a9ce1b2…</code
										>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex max-h-full w-full flex-col items-center gap-3 overflow-y-auto pb-28 md:pb-0">
	<Guide {steps} {active} onselect={(i) => (peek = i)} visual={scene} />
</div>

<style>
	.laptop {
		position: relative;
		width: 100%;
		max-width: 400px;
	}
	.lid {
		border-radius: 14px 14px 4px 4px;
		background: var(--color-ink);
		padding: 9px 9px 10px;
	}
	.screen {
		height: 214px;
		overflow: hidden;
		border-radius: 6px;
		background: var(--color-card);
	}
	.base {
		height: 12px;
		margin: 0 -18px;
		border-radius: 2px 2px 12px 12px;
		background: color-mix(in srgb, var(--color-ink) 75%, var(--color-faint));
	}
	.browser {
		padding: 10px;
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 5px 12px;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.lockico {
		position: relative;
		display: inline-block;
		width: 8px;
		height: 7px;
		margin-top: 3px;
		border-radius: 1.5px;
		background: var(--color-grass);
	}
	.lockico::before {
		content: '';
		position: absolute;
		left: 1px;
		top: -5px;
		width: 6px;
		height: 6px;
		border: 1.5px solid var(--color-grass);
		border-bottom: none;
		border-radius: 4px 4px 0 0;
		box-sizing: border-box;
	}
	.lockico.dark {
		background: var(--color-muted);
		margin-right: 5px;
	}
	.lockico.dark::before {
		border-color: var(--color-muted);
	}
	.page {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 16px 6px 0;
	}
	.page i {
		display: block;
		height: 9px;
		border-radius: 5px;
		background: var(--color-line);
	}
	.page i.w60 {
		width: 60%;
		height: 14px;
		background: var(--color-brand-soft);
	}
	.page i.w90 {
		width: 90%;
	}
	.page i.w75 {
		width: 75%;
	}
	.cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-top: 6px;
	}
	.cards i {
		height: 64px;
		border-radius: 8px;
	}
	.fly {
		position: absolute;
		top: 40%;
		right: -6px;
		width: 60px;
		height: 60px;
		pointer-events: none;
	}
	.env {
		position: absolute;
		left: 0;
		top: 22px;
		width: 18px;
		height: 12px;
		border-radius: 2px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-card);
		opacity: 0;
		animation: out 2.2s ease-in-out infinite;
	}
	.env.back {
		border-color: var(--color-grass);
		animation-name: in;
	}
	@keyframes out {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: translate(46px, -30px);
			opacity: 0;
		}
	}
	@keyframes in {
		0% {
			transform: translate(46px, 26px);
			opacity: 0;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translate(0, 0);
			opacity: 0;
		}
	}
	.ws {
		display: flex;
		flex-direction: column;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
	}
	.wsbar {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 5px 9px;
		border-bottom: 1px solid var(--color-line);
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.rec {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-danger);
	}
	.row {
		display: grid;
		grid-template-columns: 22px 52px 1fr;
		gap: 4px;
		width: 100%;
		padding: 2.5px 9px;
		text-align: left;
		color: var(--color-ink);
		animation: rowin 0.3s ease-out;
		cursor: default;
	}
	.row.tap {
		cursor: pointer;
	}
	.row.head {
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 10px;
		color: var(--color-faint);
		animation: none;
	}
	.row .inf {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.row.dns {
		background: var(--color-brand-soft);
	}
	.row.tcp {
		background: var(--color-paper);
	}
	.row.hello,
	.row.data {
		background: var(--color-grass-soft);
	}
	.row.sel {
		background: var(--color-ink);
		color: var(--color-card);
	}
	.row.tap:hover:not(.sel) {
		outline: 1px solid var(--color-brand);
		outline-offset: -1px;
	}
	@keyframes rowin {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	.parcel {
		width: 100%;
		max-width: 400px;
		animation: rowin 0.35s ease-out;
	}
	.wrap {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		padding: 5px 7px 7px;
	}
	.wrap .wrap {
		margin-top: 4px;
	}
	.l2 {
		background: var(--color-amber-soft);
		border-color: color-mix(in srgb, var(--color-amber) 50%, transparent);
	}
	.l3 {
		background: var(--color-brand-soft);
		border-color: color-mix(in srgb, var(--color-brand) 40%, transparent);
	}
	.l4 {
		background: var(--color-grass-soft);
		border-color: color-mix(in srgb, var(--color-grass) 45%, transparent);
	}
	.core {
		background: var(--color-card);
	}
	.core.locked {
		background: var(--color-paper);
	}
	.lh {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 2px 8px;
		font-size: 11px;
	}
	.lh span {
		font-weight: 700;
		color: var(--color-ink);
	}
	.lh code {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.core .lh code {
		color: var(--color-ink);
		font-weight: 600;
	}
	.core .lh code.noise {
		color: var(--color-faint);
	}
	@media (max-width: 767px) {
		.screen {
			height: 196px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.env {
			animation: none;
			opacity: 1;
		}
		.env.back {
			transform: translate(30px, 20px);
		}
		.row,
		.parcel {
			animation: none;
		}
	}
</style>
