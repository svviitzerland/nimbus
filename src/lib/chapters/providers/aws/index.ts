import AwsStage from '$lib/components/stages/AwsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aws: Lesson = {
	id: 'aws',
	mood: 'happy',
	moods: ['calm', 'thinking', 'worried', 'idea', 'wink', 'excited'],
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
	stage: AwsStage,
	text: { id, en }
};
