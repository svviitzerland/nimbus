import FineTuningStage from '$lib/components/stages/FineTuningStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const fineTuning: Lesson = {
	id: 'fine-tuning',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'thinking', 'wink', 'worried', 'excited'],
	reactionMood: {
		ask: 'thinking',
		pick: 'happy',
		pick_bad: 'worried',
		tuning: 'thinking',
		tuned_good: 'excited',
		tuned_rude: 'surprised',
		tuned_wrong: 'surprised',
		stale: 'idea',
		compare: 'wink'
	},
	stage: FineTuningStage,
	text: { id, en }
};
