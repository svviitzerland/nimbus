<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { FirewallText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as FirewallText);

	let guest = $state<'' | 'web' | 'bad'>('');
	let checking = $state(false);
	let verdict = $state<'' | 'allow' | 'deny'>('');
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function send(kind: 'web' | 'bad') {
		guest = kind;
		verdict = '';
		checking = false;
		timers.forEach(clearTimeout);
		timers = [];
		// walk to the gate, get checked, then pass or bounce
		timers.push(setTimeout(() => (checking = true), 900));
		timers.push(
			setTimeout(() => {
				checking = false;
				verdict = kind === 'web' ? 'allow' : 'deny';
				onstate?.(kind === 'web' ? 'allow' : 'deny');
				tried.add(kind);
				if (tried.size === 2 && !done) {
					done = true;
					oncomplete?.();
				}
				timers.push(setTimeout(() => (guest = ''), 1400));
			}, 1700)
		);
	}

	const note = $derived(
		checking
			? ' '
			: verdict === 'allow'
				? tx.noteAllow
				: verdict === 'deny'
					? tx.noteDeny
					: tx.noteIdle
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet person(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="8" r="4" fill={color} />
		<path d="M4 21a8 8 0 0 1 16 0Z" fill={color} />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- the guest list the guard holds -->
		<div class="rules">
			<b>{tx.rulesTitle}</b>
			<span class="r ok">✓ {tx.ruleAllow}</span>
			<span class="r no">× {tx.ruleDeny}</span>
			<span class="ruletail"></span>
		</div>

		<!-- outside, the wall with one guarded gate, and the server inside -->
		<div class="floor">
			<div class="ground"></div>

			<!-- the wall itself, bricks above and below one gate -->
			<div class="wall">
				<span class="brickcol top">
					<i></i><i></i><i></i>
				</span>
				<div class="gatehole" class:busy={checking}>
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M12 2 4 5.5v5.2c0 5 3.4 9 8 11.3 4.6-2.3 8-6.3 8-11.3V5.5Z"
							stroke="#2e6fe0"
							stroke-width="1.9"
							stroke-linejoin="round"
							fill="#eaf1fc"
						/>
						<path
							d="m8.8 12 2.2 2.2 4.4-4.4"
							stroke="#2e6fe0"
							stroke-width="1.9"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<span class="brickcol bot">
					<i></i><i></i><i></i>
				</span>
			</div>
			<span class="wlabel"><b>{tx.guardLabel}</b><span>{tx.guardSub}</span></span>

			<!-- the visiting guest -->
			{#if guest}
				{#key guest}
					<div
						class="walker"
						class:checking
						class:through={verdict === 'allow'}
						class:bounced={verdict === 'deny'}
					>
						{@render person(17, guest === 'web' ? '#3a9c64' : '#d3584a')}
						<span class="gtag" style="color:{guest === 'web' ? '#2f7d54' : '#b8392c'}">
							{guest === 'web' ? tx.guestWeb : tx.guestBad}
						</span>
					</div>
				{/key}
			{/if}
			{#if checking}
				<span class="check">?</span>
			{/if}
			{#if verdict}
				<span class="vtag" class:no={verdict === 'deny'}
					>{verdict === 'allow' ? tx.allowedTag : tx.deniedTag}</span
				>
			{/if}

			<!-- the server safe behind the wall -->
			<div class="srvwrap" class:got={verdict === 'allow'}>
				<Server active={verdict === 'allow'} />
				<span class="alabel">{tx.serverLabel}</span>
			</div>
		</div>
	</div>

	<p class="note">{note}</p>

	<div class="acts">
		<button
			type="button"
			class="cta"
			class:dim={tried.has('web')}
			onclick={() => send('web')}
			disabled={guest !== ''}>{tx.sendWeb}</button
		>
		<button
			type="button"
			class="line"
			class:dim={tried.has('bad')}
			onclick={() => send('bad')}
			disabled={guest !== ''}>{tx.sendBad}</button
		>
	</div>
</div>

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		width: min(94vw, 372px);
	}
	.rules {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 3px;
		border-radius: 13px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 9px 14px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
	}
	.rules b {
		font-size: 9.5px;
		font-weight: 800;
		color: #8a949d;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.r {
		font-size: 11px;
		font-weight: 700;
	}
	.r.ok {
		color: #2f7d54;
	}
	.r.no {
		color: #b8392c;
	}
	/* a little speech tail pointing down to the guard */
	.ruletail {
		position: absolute;
		bottom: -6px;
		left: 50%;
		width: 10px;
		height: 10px;
		background: #fff;
		border-right: 1px solid #e8e2d8;
		border-bottom: 1px solid #e8e2d8;
		transform: translateX(-50%) rotate(45deg);
	}

	.floor {
		position: relative;
		width: 100%;
		height: 132px;
	}
	.ground {
		position: absolute;
		top: 58px;
		left: 2%;
		right: 2%;
		border-top: 2px solid #e3ded5;
	}

	/* the firewall is literally a wall with a single gate */
	.wall {
		position: absolute;
		top: 0;
		bottom: 22px;
		left: 58%;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translateX(-50%);
		z-index: 2;
	}
	.brickcol {
		display: flex;
		flex: 1;
		width: 14px;
		flex-direction: column;
		gap: 2px;
	}
	.brickcol i {
		flex: 1;
		border-radius: 4px;
		background: #d9e4f5;
		border: 1px solid #c2d4f0;
	}
	.gatehole {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		margin: 3px 0;
		border-radius: 50%;
		background: #fff;
		border: 1.5px solid #cdddf6;
		box-shadow: 0 6px 16px rgba(46, 111, 224, 0.16);
		transition: box-shadow 0.25s ease;
	}
	.gatehole.busy {
		box-shadow: 0 0 0 6px rgba(46, 111, 224, 0.18);
		animation: scan 0.4s ease-in-out 2;
	}
	@keyframes scan {
		50% {
			transform: rotate(-8deg);
		}
	}
	.wlabel {
		position: absolute;
		bottom: -2px;
		left: 58%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.15;
		white-space: nowrap;
	}
	.wlabel b {
		font-size: 10.5px;
		font-weight: 800;
		color: #2e6fe0;
	}
	.wlabel span {
		font-size: 8px;
		color: #8a949d;
	}

	.walker {
		position: absolute;
		top: 34px;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		line-height: 0;
		z-index: 3;
		animation: approach 0.95s ease-out forwards;
	}
	.walker.checking {
		animation: none;
		left: 47%;
	}
	.walker.through {
		animation: through 0.8s ease-in forwards;
	}
	.walker.bounced {
		animation: bounce 0.8s ease forwards;
	}
	.gtag {
		font-size: 9px;
		font-weight: 800;
		white-space: nowrap;
		line-height: 1;
	}
	@keyframes approach {
		from {
			left: -4%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: 47%;
			opacity: 1;
		}
	}
	@keyframes through {
		from {
			left: 47%;
			opacity: 1;
		}
		to {
			left: 86%;
			opacity: 0;
		}
	}
	@keyframes bounce {
		from {
			left: 47%;
			opacity: 1;
		}
		30% {
			left: 40%;
		}
		to {
			left: 2%;
			opacity: 0.2;
		}
	}
	.check {
		position: absolute;
		top: 6px;
		left: 47%;
		transform: translateX(-50%);
		border-radius: 50%;
		width: 17px;
		height: 17px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #dd9e36;
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		z-index: 4;
		animation: popin 0.25s ease;
	}
	.vtag {
		position: absolute;
		top: 4px;
		left: 58%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #3a9c64;
		color: #fff;
		font-size: 9.5px;
		font-weight: 800;
		padding: 3px 10px;
		animation: popin 0.25s ease;
		z-index: 4;
		box-shadow: 0 4px 10px rgba(22, 40, 60, 0.18);
	}
	.vtag.no {
		background: #d3584a;
	}
	@keyframes popin {
		from {
			transform: translateX(-50%) scale(0.4);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) scale(1);
			opacity: 1;
		}
	}

	.srvwrap {
		position: absolute;
		top: 26px;
		right: 1%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		transition: transform 0.3s ease;
	}
	.srvwrap.got :global(.server) {
		border-color: var(--color-grass);
	}
	.srvwrap :global(.server) {
		width: 58px;
		padding: 7px;
		border-radius: 10px;
		border-width: 1.5px;
	}
	.srvwrap :global(.server .slot) {
		height: 9px;
	}
	.alabel {
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: #16212b;
		color: #fff;
		padding: 11px 18px;
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
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:enabled:hover {
		border-color: #16212b;
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.55;
	}
	.dim::after {
		content: ' ✓';
		color: #3a9c64;
	}

	:global(.dark) .rules {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .rules b {
		color: var(--color-faint);
	}
	:global(.dark) .r.ok {
		color: var(--color-grass);
	}
	:global(.dark) .r.no {
		color: var(--color-danger);
	}
	:global(.dark) .ruletail {
		background: var(--color-card);
		border-right-color: var(--color-line);
		border-bottom-color: var(--color-line);
	}
	:global(.dark) .ground {
		border-color: var(--color-line);
	}
	:global(.dark) .brickcol i {
		background: color-mix(in srgb, var(--color-brand) 25%, transparent);
		border-color: color-mix(in srgb, var(--color-brand) 35%, transparent);
	}
	:global(.dark) .gatehole {
		background: var(--color-card);
		border-color: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
	:global(.dark) .gatehole svg path {
		fill: var(--color-brand-soft);
	}
	:global(.dark) .wlabel b {
		color: var(--color-brand);
	}
	:global(.dark) .wlabel span {
		color: var(--color-faint);
	}
	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .cta {
		background: var(--color-brand);
		box-shadow: none;
	}
	:global(.dark) .line {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	:global(.dark) .line:enabled:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.walker,
		.vtag,
		.check,
		.gatehole.busy {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 520px;
			gap: 18px;
		}
		.rules b {
			font-size: 11px;
		}
		.r {
			font-size: 13px;
		}
		.floor {
			height: 158px;
		}
		.ground {
			top: 70px;
		}
		.walker {
			top: 42px;
		}
		.brickcol {
			width: 17px;
		}
		.gatehole {
			width: 44px;
			height: 44px;
		}
		.gatehole svg {
			width: 26px;
			height: 26px;
		}
		.wlabel b {
			font-size: 12.5px;
		}
		.wlabel span {
			font-size: 9.5px;
		}
		.gtag {
			font-size: 10.5px;
		}
		.vtag {
			font-size: 11px;
		}
		.srvwrap {
			top: 32px;
		}
		.srvwrap :global(.server) {
			width: 72px;
		}
		.srvwrap :global(.server .slot) {
			height: 11px;
		}
		.alabel {
			font-size: 11.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
