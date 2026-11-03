<script lang="ts">
	// The AWS lesson, the shared provider board wearing AWS service names.
	import ProviderBoard from './cloudops/ProviderBoard.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SlotKey } from './cloudops/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();

	const services: Record<SlotKey, string> = {
		dns: 'Route 53',
		cdn: 'CloudFront',
		lb: 'Elastic Load Balancing',
		network: 'VPC',
		firewall: 'Security Groups',
		vm: 'EC2',
		container: 'ECS',
		function: 'Lambda',
		files: 'S3',
		sql: 'RDS',
		nosql: 'DynamoDB',
		iam: 'IAM',
		keys: 'KMS',
		monitor: 'CloudWatch'
	};
</script>

<ProviderBoard {text} {oncomplete} {onstate} provider="aws" {services} />
