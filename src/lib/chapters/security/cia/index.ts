import CiaStage from '$lib/components/stages/CiaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cia: Lesson = {
	id: 'cia',
	mood: 'thinking',
	moods: [
		'calm',
		'surprised',
		'worried',
		'thinking',
		'wink',
		'worried',
		'surprised',
		'sad',
		'idea',
		'excited'
	],
	reactionMood: {
		c: 'thinking',
		i: 'wink',
		a: 'idea'
	},
	stage: CiaStage,
	text: { id, en }
};
