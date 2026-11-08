<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { IamText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IamText);

	let badge = $state<'' | 'admin' | 'scoped'>('');
	const tried = new SvelteSet<string>();
	let done = false;

	function wear(b: 'admin' | 'scoped') {
		badge = b;
		onstate?.(b);
		tried.add(b);
		if (tried.size === 2 && !done) {
			done = true;
			oncomplete?.();
		}
	}

	function isOpen(scopedDoor: boolean) {
		if (badge === 'admin') return true;
		if (badge === 'scoped') return scopedDoor;
		return false;
	}
	const note = $derived(
		badge === 'admin' ? tx.noteAdmin : badge === 'scoped' ? tx.noteScoped : tx.noteIdle
	);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- Budi and whatever card he is holding -->
		<div class="who">
			<div class="avatar">
				<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="#16212b" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="#16212b" />
				</svg>
				{#if badge}
					{#key badge}
						<span class="card" class:adminc={badge === 'admin'}>
							{badge === 'admin' ? tx.badgeAdmin : tx.badgeScoped}
						</span>
					{/key}
				{/if}
			</div>
			<span class="alabel">{tx.personLabel}</span>
		</div>

		<!-- the three doors -->
		<div class="doors">
			{#each tx.doors as d (d.key)}
				{@const open = isOpen(d.scoped)}
				<div class="door" class:open={badge && open} class:shut={badge && !open}>
					<span class="dicon">
						{#if badge && open}
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect
									x="5"
									y="10.5"
									width="14"
									height="9.5"
									rx="2.5"
									stroke="#2f7d54"
									stroke-width="2"
								/>
								<path
									d="M8.5 10.5V7a3.5 3.5 0 0 1 6.6-1.6"
									stroke="#2f7d54"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						{:else}
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect
									x="5"
									y="10.5"
									width="14"
									height="9.5"
									rx="2.5"
									stroke="#8a949d"
									stroke-width="2"
								/>
								<path
									d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"
									stroke="#8a949d"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						{/if}
					</span>
					<b>{d.label}</b>
					{#if badge}
						<span class="dstat" class:ok={open}>{open ? tx.openTag : tx.shutTag}</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<p class="note">{note}</p>

	<div class="acts">
		<div class="pick" class:on={badge === 'admin'} class:dim={tried.has('admin')}>
			<CallToActionButton onclick={() => wear('admin')}>
				<b>{tx.badgeAdmin}</b><span>{tx.badgeAdminSub}</span>
			</CallToActionButton>
		</div>
		<div class="pick" class:on={badge === 'scoped'} class:dim={tried.has('scoped')}>
			<CallToActionButton onclick={() => wear('scoped')}>
				<b>{tx.badgeScoped}</b><span>{tx.badgeScopedSub}</span>
			</CallToActionButton>
		</div>
	</div>
</div>

<style>
	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 18px;
	}
	.who {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.avatar {
		position: relative;
		display: flex;
		width: 64px;
		height: 64px;
		align-items: center;
		justify-content: center;
		border-radius: 18px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 8px 18px rgba(22, 40, 60, 0.07);
	}
	.card {
		position: absolute;
		bottom: -9px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #3a9c64;
		color: #fff;
		font-size: 8px;
		font-weight: 800;
		padding: 2px 8px;
		white-space: nowrap;
		animation: cardin 0.3s ease;
	}
	.card.adminc {
		background: #d3584a;
	}
	@keyframes cardin {
		from {
			transform: translateX(-50%) scale(0.5);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) scale(1);
			opacity: 1;
		}
	}
	.alabel {
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
		white-space: nowrap;
		margin-top: 4px;
	}
	.doors {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.door {
		display: flex;
		align-items: center;
		gap: 7px;
		width: 168px;
		border-radius: 12px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		padding: 8px 10px;
		transition: all 0.3s ease;
	}
	.door b {
		flex: 1;
		font-size: 10.5px;
		font-weight: 700;
		color: #16212b;
	}
	.door.open {
		border-color: #cde6d7;
		background: #f0f9f3;
	}
	.door.shut {
		opacity: 0.75;
		background: #f7f6f2;
	}
	.dicon {
		line-height: 0;
	}
	.dstat {
		border-radius: 999px;
		background: #eef0f2;
		color: #8a949d;
		font-size: 8px;
		font-weight: 800;
		padding: 1px 7px;
		animation: cardin2 0.25s ease;
	}
	.dstat.ok {
		background: #3a9c64;
		color: #fff;
	}
	@keyframes cardin2 {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.note {
		min-height: 1.4em;
		max-width: 330px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.acts {
		display: flex;
		gap: 8px;
	}
	.pick {
		position: relative;
	}
	.pick :global(.cta) {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 13px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 9px 16px;
		line-height: 1.2;
		font-size: 12.5px;
		font-weight: 800;
		color: #16212b;
		box-shadow: none;
		animation: pulse 1.8s ease-in-out infinite;
	}
	.pick :global(.cta span) {
		font-size: 8.5px;
		font-weight: 600;
		color: #8a949d;
		white-space: nowrap;
	}
	.pick.dim :global(.cta) {
		animation: none;
	}
	.pick.dim:not(.on)::after {
		content: '✓';
		position: absolute;
		top: 2px;
		right: 6px;
		color: #3a9c64;
		font-size: 10px;
		font-weight: 800;
		z-index: 1;
	}
	.pick.on :global(.cta) {
		border-color: #16212b;
		background: #16212b;
		animation: none;
	}
	.pick.on :global(.cta),
	.pick.on :global(.cta span) {
		color: #fff;
	}
	.pick :global(.cta:enabled:hover) {
		border-color: #16212b;
		filter: none;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.14);
		}
	}
	:global(.dark) .avatar {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .avatar svg circle,
	:global(.dark) .avatar svg path {
		fill: var(--color-ink);
	}
	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .door {
		border-color: var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .door b {
		color: var(--color-ink);
	}
	:global(.dark) .door.open {
		border-color: color-mix(in srgb, var(--color-grass) 25%, transparent);
		background: color-mix(in srgb, var(--color-grass) 10%, transparent);
	}
	:global(.dark) .door.shut {
		background: var(--color-paper);
	}
	:global(.dark) .dicon svg rect,
	:global(.dark) .dicon svg path {
		stroke: var(--color-faint);
	}
	:global(.dark) .door.open .dicon svg rect,
	:global(.dark) .door.open .dicon svg path {
		stroke: var(--color-grass);
	}
	:global(.dark) .dstat {
		background: var(--color-paper);
		color: var(--color-faint);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .pick :global(.cta) {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	:global(.dark) .pick :global(.cta span) {
		color: var(--color-faint);
	}
	:global(.dark) .pick.on :global(.cta) {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}
	:global(.dark) .pick.on :global(.cta),
	:global(.dark) .pick.on :global(.cta span) {
		color: #fff;
	}
	:global(.dark) .pick :global(.cta:enabled:hover) {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.pick :global(.cta),
		.card,
		.dstat {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			gap: 34px;
		}
		.avatar {
			width: 84px;
			height: 84px;
		}
		.avatar svg {
			width: 34px;
			height: 34px;
		}
		.card {
			font-size: 10px;
		}
		.alabel {
			font-size: 12px;
		}
		.door {
			width: 230px;
			padding: 11px 13px;
		}
		.door b {
			font-size: 13px;
		}
		.dstat {
			font-size: 9.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.pick :global(.cta) {
			padding: 11px 22px;
		}
		.pick :global(.cta span) {
			font-size: 10px;
		}
	}
</style>
