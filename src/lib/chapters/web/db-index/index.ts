import DbIndexStage from '$lib/components/stages/DbIndexStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dbIndex: Lesson = {
	id: 'db-index',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		small: 'calm',
		mid: 'surprised',
		big: 'excited',
		huge: 'excited'
	},
	playable: true,
	stage: DbIndexStage,
	text: { id, en }
};
