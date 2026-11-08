import EvaluationStage from '$lib/components/stages/EvaluationStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const evaluation: Lesson = {
	id: 'evaluation',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'wink', 'excited'],
	reactionMood: {
		lazy: 'surprised',
		low: 'worried',
		catch_all: 'happy',
		miss: 'sad',
		best_acc: 'thinking',
		done: 'excited'
	},
	playable: true,
	stage: EvaluationStage,
	text: { id, en }
};
