<script lang="ts">
	// The page frame shared by the guided security basics stages (cia, threats, hat-colors,
	// hashing, mfa, sso). It centres the shared Guide layout, keeps room for Nim's bubble on
	// phones, and shows an optional one line hint over the visual on the last beat.
	import type { Snippet } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { GuideStep } from './guided.svelte';

	let {
		steps,
		active,
		onselect,
		visual,
		hint = '',
		accent
	}: {
		steps: GuideStep[];
		active: number;
		onselect?: (i: number) => void;
		visual: Snippet<[number]>;
		hint?: string;
		accent?: string;
	} = $props();
</script>

<div class="wrap">
	<p class="hint" class:show={!!hint} aria-hidden={!hint}>{hint}</p>
	<Guide {steps} {active} {onselect} {visual} {accent} />
</div>

<style>
	.wrap {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 10px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			justify-content: center;
			padding-bottom: 1rem;
		}
	}
	.hint {
		margin: 0;
		min-height: 1.4em;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.hint.show {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.hint {
			transition: none;
		}
	}
</style>
