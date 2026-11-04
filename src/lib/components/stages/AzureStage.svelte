<script lang="ts">
	// The Azure lesson, the shared guided provider board wearing Azure service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { StageProps } from '$lib/chapters/types';

	let props: StageProps = $props();
</script>

<ProviderBoard {...props} provider="azure" sticky="files" />
