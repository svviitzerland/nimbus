import IdsStage from '$lib/components/stages/IdsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ids: Lesson = {
	id: 'ids',
	mood: 'thinking',
	moods: ['worried', 'idea', 'wink', 'thinking', 'calm', 'excited'],
	reactionMood: {
		ids: 'surprised',
		strict: 'worried',
		loose: 'sad',
		perfect: 'excited'
	},
	stage: IdsStage,
	text: { id, en }
};
