import OverfittingStage from '$lib/components/stages/OverfittingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const overfitting: Lesson = {
	id: 'overfitting',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		practice: 'excited',
		reveal: 'thinking',
		under: 'worried',
		fit: 'happy',
		over: 'surprised',
		done: 'excited'
	},
	playable: true,
	stage: OverfittingStage,
	text: { id, en }
};
