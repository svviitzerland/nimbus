import TestingStage from '$lib/components/stages/TestingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const testing: Lesson = {
	id: 'testing',
	mood: 'calm',
	moods: [
		'worried',
		'idea',
		'happy',
		'calm',
		'thinking',
		'surprised',
		'happy',
		'wink',
		'calm',
		'excited'
	],
	reactionMood: { broke: 'surprised', fixed: 'happy' },
	stage: TestingStage,
	text: { id, en }
};
