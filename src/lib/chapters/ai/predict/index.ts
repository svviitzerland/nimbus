import PredictStage from '$lib/components/stages/PredictStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const predict: Lesson = {
	id: 'predict',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'wink', 'happy', 'excited'],
	reactionMood: {
		reg_add: 'happy',
		reg_ask: 'idea',
		cls_add: 'happy',
		cls_ask: 'idea',
		cls_flip: 'surprised',
		both: 'excited'
	},
	stage: PredictStage,
	text: { id, en }
};
