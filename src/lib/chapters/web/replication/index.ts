import ReplicationStage from '$lib/components/stages/ReplicationStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const replication: Lesson = {
	id: 'replication',
	mood: 'calm',
	moods: [
		'worried',
		'thinking',
		'idea',
		'calm',
		'happy',
		'surprised',
		'thinking',
		'wink',
		'idea',
		'calm'
	],
	stage: ReplicationStage,
	text: { id, en }
};
