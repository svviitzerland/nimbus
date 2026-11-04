import SubnetStage from '$lib/components/stages/SubnetStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const subnet: Lesson = {
	id: 'subnet',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'thinking',
		'happy',
		'surprised',
		'excited',
		'wink',
		'thinking',
		'idea',
		'happy'
	],
	reactionMood: {
		split: 'idea',
		merge: 'happy',
		one: 'surprised'
	},
	stage: SubnetStage,
	text: { id, en }
};
