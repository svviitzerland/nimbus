import PredictStage from '$lib/components/stages/PredictStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const predict: Lesson = {
	id: 'predict',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'surprised', 'excited'],
	reactionMood: {
		ask: 'happy'
	},
	stage: PredictStage,
	text: { id, en }
};
