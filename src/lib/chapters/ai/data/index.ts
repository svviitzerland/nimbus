import DataStage from '$lib/components/stages/DataStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const data: Lesson = {
	id: 'data',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'worried', 'wink', 'excited'],
	reactionMood: {
		messy: 'surprised',
		look: 'idea',
		fix: 'happy',
		oops: 'worried',
		toss: 'happy',
		toss_good: 'thinking',
		still: 'thinking',
		clean: 'excited'
	},
	stage: DataStage,
	text: { id, en }
};
