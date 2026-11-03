import GcpStage from '$lib/components/stages/GcpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const gcp: Lesson = {
	id: 'gcp',
	mood: 'happy',
	moods: ['calm', 'thinking', 'happy', 'surprised', 'excited'],
	reactionMood: {
		dns: 'wink',
		cdn: 'happy',
		lb: 'happy',
		network: 'idea',
		firewall: 'happy',
		vm: 'idea',
		container: 'happy',
		function: 'wink',
		files: 'surprised',
		sql: 'happy',
		nosql: 'idea',
		iam: 'thinking',
		keys: 'idea',
		monitor: 'happy',
		miss: 'thinking',
		live: 'excited'
	},
	stage: GcpStage,
	text: { id, en }
};
