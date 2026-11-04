import DataStage from '$lib/components/stages/DataStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const data: Lesson = {
	id: 'data',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'worried',
		'wink',
		'surprised',
		'happy',
		'thinking',
		'excited',
		'idea',
		'happy'
	],
	reactionMood: {
		messy: 'worried',
		clean: 'excited'
	},
	stage: DataStage,
	text: { id, en }
};
