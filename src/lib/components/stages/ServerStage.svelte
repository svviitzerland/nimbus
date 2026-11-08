<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import type { LessonText, ServerText } from '$lib/chapters/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ServerText);

	let phase = $state<'idle' | 'req' | 'res'>('idle'); // the packet
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let busy = $state(false);
	let count = $state(0);
	let timers: ReturnType<typeof setTimeout>[] = [];

	const packetLeft = $derived(phase === 'req' ? '100%' : '0%');
	const packetOpacity = $derived(phase === 'idle' ? 0 : 1);
	const packetColor = $derived(phase === 'res' ? '#3a9c64' : '#2e6fe0');
	const packetLabel = $derived(phase === 'res' ? tx.response : tx.request);

	function visit() {
		if (busy) return;
		busy = true;
		browser = 'loading';
		phase = 'req';
		timers.push(setTimeout(() => (phase = 'res'), 800));
		timers.push(
			setTimeout(() => {
				phase = 'idle';
				browser = 'loaded';
				count += 1;
				busy = false;
				if (count === 1) {
					onstate?.('served');
					oncomplete?.();
				}
			}, 1600)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-7">
	<div class="flex w-full max-w-2xl items-center justify-center gap-3 md:gap-6">
		<!-- phone (visitor) -->
		<div class="flex shrink-0 flex-col items-center gap-2">
			<Browser phase={browser} />
			<span class="text-xs font-semibold text-muted">{tx.you}</span>
		</div>

		<!-- connection + packet -->
		<div class="relative h-0.5 max-w-[220px] min-w-[60px] flex-1 self-center bg-line">
			<div
				class="packet"
				style="left:{packetLeft}; opacity:{packetOpacity}; background:{packetColor};"
			>
				{packetLabel}
			</div>
		</div>

		<!-- server -->
		<div class="flex shrink-0 flex-col items-center gap-2">
			<Server active={phase === 'res'} />
			<span class="text-xs font-semibold text-muted">{tx.server}</span>
		</div>
	</div>

	<div class="flex flex-col items-center">
		<CallToActionButton onclick={visit} disabled={busy}>
			{tx.open}
		</CallToActionButton>
		{#if count > 0}
			<p class="mt-3 text-sm font-semibold text-grass">
				✓ {tx.count.replace('{n}', String(count))}
			</p>
		{/if}
	</div>
</div>

<style>
	.packet {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 4px 10px;
		border-radius: 999px;
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
		transition:
			left 0.8s ease,
			opacity 0.3s ease,
			background 0.3s ease;
		box-shadow: 0 3px 8px rgba(22, 40, 60, 0.18);
	}
</style>
