<script lang="ts">
	// The Google Cloud lesson, the shared provider board wearing Google Cloud service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SlotKey } from './cloudops/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();

	const services: Record<SlotKey, string> = {
		dns: 'Cloud DNS',
		cdn: 'Cloud CDN',
		lb: 'Cloud Load Balancing',
		network: 'VPC',
		firewall: 'Firewall rules',
		vm: 'Compute Engine',
		container: 'Cloud Run',
		function: 'Cloud Functions',
		files: 'Cloud Storage',
		sql: 'Cloud SQL',
		nosql: 'Firestore',
		iam: 'IAM',
		keys: 'Cloud KMS',
		monitor: 'Cloud Monitoring'
	};
</script>

<ProviderBoard {text} {oncomplete} {onstate} provider="gcp" {services} />
