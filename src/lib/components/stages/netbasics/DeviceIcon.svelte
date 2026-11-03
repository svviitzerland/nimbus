<!--
	Small line icons for the network basics lessons (phone, laptop, desktop, router, switch,
	modem or ONT, access point, a person, a server, a globe). Stroke follows currentColor so the
	caller picks the colour; bodies fill with the card token so dark mode works.
-->
<script module lang="ts">
	export type DeviceKind =
		| 'phone'
		| 'laptop'
		| 'pc'
		| 'router'
		| 'switch'
		| 'modem'
		| 'ap'
		| 'person'
		| 'server'
		| 'globe'
		| 'building';
</script>

<script lang="ts">
	let { kind, size = 28 }: { kind: DeviceKind; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if kind === 'phone'}
		<rect x="7" y="2.5" width="10" height="19" rx="2.4" class="b" />
		<path d="M10.5 18.5h3" />
	{:else if kind === 'laptop'}
		<rect x="4.5" y="5" width="15" height="10.5" rx="1.6" class="b" />
		<path d="M2.5 18.5h19l-1.5 1.5H4Z" class="b" />
	{:else if kind === 'pc'}
		<rect x="3" y="3.5" width="18" height="12.5" rx="1.6" class="b" />
		<path d="M12 16v3.5M8 20h8" />
	{:else if kind === 'router'}
		<path d="M7 13 5.2 6M17 13l1.8-7" />
		<rect x="3" y="13" width="18" height="6.5" rx="1.8" class="b" />
		<circle cx="7" cy="16.25" r=".6" fill="currentColor" />
		<circle cx="9.5" cy="16.25" r=".6" fill="currentColor" />
		<circle cx="12" cy="16.25" r=".6" fill="currentColor" />
	{:else if kind === 'switch'}
		<rect x="2" y="8.5" width="20" height="7" rx="1.6" class="b" />
		<path d="M5 12.5v-1h1.6v1M8.6 12.5v-1h1.6v1M12.2 12.5v-1h1.6v1M15.8 12.5v-1h1.6v1" />
	{:else if kind === 'modem'}
		<rect x="6.5" y="3" width="11" height="18" rx="1.8" class="b" />
		<circle cx="12" cy="7" r=".7" fill="currentColor" />
		<circle cx="12" cy="10" r=".7" fill="currentColor" />
		<circle cx="12" cy="13" r=".7" fill="currentColor" />
		<path d="M9.5 17.5h5" />
	{:else if kind === 'ap'}
		<ellipse cx="12" cy="16.5" rx="8" ry="3" class="b" />
		<path d="M8.6 10.6a5 5 0 0 1 6.8 0M6 8a8.5 8.5 0 0 1 12 0" />
		<circle cx="12" cy="16.5" r=".7" fill="currentColor" />
	{:else if kind === 'person'}
		<circle cx="12" cy="8" r="4" class="b" />
		<path d="M4.5 21a7.5 7.5 0 0 1 15 0Z" class="b" />
	{:else if kind === 'server'}
		<rect x="5" y="3" width="14" height="18" rx="2" class="b" />
		<path d="M5 9h14M5 15h14" />
		<circle cx="8.5" cy="6" r=".7" fill="currentColor" />
		<circle cx="8.5" cy="12" r=".7" fill="currentColor" />
		<circle cx="8.5" cy="18" r=".7" fill="currentColor" />
	{:else if kind === 'globe'}
		<circle cx="12" cy="12" r="9" class="b" />
		<path
			d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z"
		/>
	{:else if kind === 'building'}
		<rect x="5" y="3" width="14" height="18" rx="1.4" class="b" />
		<path d="M8.5 7h2M13.5 7h2M8.5 11h2M13.5 11h2M8.5 15h2M13.5 15h2M10.5 21v-2.5h3V21" />
	{/if}
</svg>

<style>
	.b {
		fill: var(--color-card);
	}
</style>
