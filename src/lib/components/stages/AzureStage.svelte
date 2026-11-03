<script lang="ts">
	// The Azure lesson, the shared provider board wearing Azure service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SlotKey } from './cloudops/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();

	const services: Record<SlotKey, string> = {
		dns: 'Azure DNS',
		cdn: 'Front Door',
		lb: 'Load Balancer',
		network: 'VNet',
		firewall: 'NSG',
		vm: 'Virtual Machines',
		container: 'Container Apps',
		function: 'Functions',
		files: 'Blob Storage',
		sql: 'Azure SQL',
		nosql: 'Cosmos DB',
		iam: 'Entra ID',
		keys: 'Key Vault',
		monitor: 'Azure Monitor'
	};
</script>

<ProviderBoard {text} {oncomplete} {onstate} provider="azure" {services} />
