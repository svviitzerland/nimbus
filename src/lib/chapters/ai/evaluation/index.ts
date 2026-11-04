import EvaluationStage from '$lib/components/stages/EvaluationStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const evaluation: Lesson = {
	id: 'evaluation',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'surprised', 'worried', 'idea', 'wink', 'happy', 'wink', 'excited'],
	reactionMood: {
		catch: 'happy',
		noisy: 'worried',
		miss: 'sad'
	},
	stage: EvaluationStage,
	text: { id, en }
};
