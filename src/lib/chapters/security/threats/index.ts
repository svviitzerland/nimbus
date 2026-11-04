import ThreatsStage from '$lib/components/stages/ThreatsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const threats: Lesson = {
	id: 'threats',
	mood: 'thinking',
	moods: ['wink', 'idea', 'thinking', 'calm', 'thinking', 'surprised', 'worried', 'wink', 'idea', 'excited'],
	reactionMood: {
		door: 'thinking',
		window: 'idea',
		gate: 'surprised',
		pot: 'wink'
	},
	stage: ThreatsStage,
	text: { id, en }
};
