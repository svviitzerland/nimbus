<script lang="ts">
	// The Gcp lesson, the shared guided provider board wearing Gcp service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { StageProps } from '$lib/chapters/types';

	let props: StageProps = $props();
</script>

<ProviderBoard {...props} provider="gcp" sticky="vm" />
