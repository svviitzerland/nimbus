import HashingStage from '$lib/components/stages/HashingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hashing: Lesson = {
	id: 'hashing',
	mood: 'thinking',
	moods: [
		'calm',
		'worried',
		'idea',
		'surprised',
		'wink',
		'happy',
		'worried',
		'excited',
		'thinking',
		'excited'
	],
	reactionMood: {
		typed: 'happy'
	},
	stage: HashingStage,
	text: { id, en }
};
