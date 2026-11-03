import ThreatsStage from '$lib/components/stages/ThreatsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const threats: Lesson = {
	id: 'threats',
	mood: 'thinking',
	moods: ['wink', 'idea', 'thinking', 'worried', 'calm', 'excited'],
	reactionMood: {
		first: 'happy',
		vendor: 'surprised',
		backup: 'idea',
		compareAll: 'excited',
		compareSome: 'wink'
	},
	stage: ThreatsStage,
	text: { id, en }
};
