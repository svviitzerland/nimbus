import FineTuningStage from '$lib/components/stages/FineTuningStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const fineTuning: Lesson = {
	id: 'fine-tuning',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'idea',
		'thinking',
		'excited',
		'wink',
		'worried',
		'surprised',
		'idea',
		'happy'
	],
	reactionMood: { bad_out: 'happy', bad_in: 'worried' },
	stage: FineTuningStage,
	text: { id, en }
};
