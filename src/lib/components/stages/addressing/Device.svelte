<!--
	Small line drawings of everyday network devices, shared by the addressing lessons
	(MAC and ARP, DHCP, NAT). Palette tokens only so dark mode follows along.
	kind    which device to draw
	size    width in px (height follows the 48 by 40 drawing)
	tone    accent colour for the lit parts (screen, LEDs)
-->
<script lang="ts">
	let {
		kind,
		size = 44,
		tone = 'var(--color-brand)'
	}: {
		kind: 'laptop' | 'phone' | 'printer' | 'tv' | 'router' | 'watch';
		size?: number;
		tone?: string;
	} = $props();
</script>

<svg
	class="dev"
	width={size}
	height={(size * 40) / 48}
	viewBox="0 0 48 40"
	fill="none"
	aria-hidden="true"
>
	{#if kind === 'laptop'}
		<rect
			x="9"
			y="5"
			width="30"
			height="21"
			rx="3"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<rect x="13" y="9" width="22" height="13" rx="1.5" fill={tone} opacity="0.22" />
		<path
			d="M4 30h40l-3 4H7Z"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
	{:else if kind === 'phone'}
		<rect
			x="16"
			y="3"
			width="16"
			height="33"
			rx="4"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<rect x="19" y="8" width="10" height="20" rx="1.5" fill={tone} opacity="0.22" />
		<circle cx="24" cy="31.5" r="1.4" fill="var(--color-muted)" />
	{:else if kind === 'printer'}
		<rect
			x="14"
			y="3"
			width="20"
			height="11"
			rx="1.5"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<rect
			x="5"
			y="12"
			width="38"
			height="17"
			rx="4"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<circle cx="36" cy="18" r="1.8" fill={tone} />
		<rect
			x="13"
			y="25"
			width="22"
			height="11"
			rx="1.5"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<path
			d="M17 30h14M17 33h9"
			stroke="var(--color-faint)"
			stroke-width="1.6"
			stroke-linecap="round"
		/>
	{:else if kind === 'tv'}
		<rect
			x="4"
			y="4"
			width="40"
			height="26"
			rx="3"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<rect x="8" y="8" width="32" height="18" rx="1.5" fill={tone} opacity="0.22" />
		<path
			d="M18 36h12M24 30v6"
			stroke="var(--color-muted)"
			stroke-width="2"
			stroke-linecap="round"
		/>
	{:else if kind === 'watch'}
		<path d="M19 3h10l1 7H18Zm0 34h10l1-7H18Z" fill="var(--color-line)" />
		<rect
			x="14"
			y="9"
			width="20"
			height="22"
			rx="6"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<rect x="18" y="13" width="12" height="14" rx="3" fill={tone} opacity="0.22" />
	{:else}
		<path
			d="M14 15 10 3M34 15l4-12"
			stroke="var(--color-muted)"
			stroke-width="2"
			stroke-linecap="round"
		/>
		<rect
			x="4"
			y="15"
			width="40"
			height="17"
			rx="4"
			fill="var(--color-card)"
			stroke="var(--color-muted)"
			stroke-width="2"
		/>
		<circle cx="12" cy="23.5" r="1.8" fill={tone} />
		<circle cx="18" cy="23.5" r="1.8" fill={tone} />
		<circle cx="24" cy="23.5" r="1.8" fill="var(--color-faint)" />
		<path
			d="M10 32v4M38 32v4"
			stroke="var(--color-muted)"
			stroke-width="2"
			stroke-linecap="round"
		/>
	{/if}
</svg>

<style>
	.dev {
		display: block;
		flex: none;
	}
</style>
