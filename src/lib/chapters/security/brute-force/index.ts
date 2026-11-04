import BruteForceStage from '$lib/components/stages/BruteForceStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const bruteForce: Lesson = {
	id: 'brute-force',
	mood: 'thinking',
	moods: [
		'calm',
		'worried',
		'thinking',
		'surprised',
		'wink',
		'idea',
		'happy',
		'thinking',
		'excited'
	],
	reactionMood: {
		weak: 'worried',
		okay: 'thinking',
		strong: 'excited'
	},
	stage: BruteForceStage,
	text: { id, en }
};
