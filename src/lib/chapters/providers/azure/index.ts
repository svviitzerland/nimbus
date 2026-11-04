import AzureStage from '$lib/components/stages/AzureStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const azure: Lesson = {
	id: 'azure',
	mood: 'happy',
	moods: [
		'calm',
		'thinking',
		'happy',
		'idea',
		'thinking',
		'happy',
		'calm',
		'wink',
		'idea',
		'excited'
	],
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
	stage: AzureStage,
	text: { id, en }
};
