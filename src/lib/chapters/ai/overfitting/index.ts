import OverfittingStage from '$lib/components/stages/OverfittingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const overfitting: Lesson = {
	id: 'overfitting',
	mood: 'thinking',
	moods: ['calm', 'worried', 'happy', 'thinking', 'surprised', 'idea', 'wink', 'excited'],
	reactionMood: {
		under: 'worried',
		fit: 'happy',
		over: 'surprised'
	},
	stage: OverfittingStage,
	text: { id, en }
};
