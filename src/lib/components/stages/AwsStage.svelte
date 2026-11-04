<script lang="ts">
	// The Aws lesson, the shared guided provider board wearing Aws service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { StageProps } from '$lib/chapters/types';

	let props: StageProps = $props();
</script>

<ProviderBoard {...props} provider="aws" sticky="vm" />
