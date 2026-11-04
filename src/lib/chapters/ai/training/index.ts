import TrainingStage from '$lib/components/stages/TrainingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const training: Lesson = {
	id: 'training',
	mood: 'thinking',
	moods: ['surprised', 'idea', 'wink', 'thinking', 'happy', 'idea', 'excited'],
	reactionMood: {
		tricky: 'excited'
	},
	stage: TrainingStage,
	text: { id, en }
};
