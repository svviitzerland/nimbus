import LearningLoopStage from '$lib/components/stages/LearningLoopStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const learningLoop: Lesson = {
	id: 'learning-loop',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'thinking',
		'idea',
		'wink',
		'worried',
		'surprised',
		'happy',
		'idea',
		'excited'
	],
	reactionMood: {
		small: 'worried',
		good: 'happy',
		big: 'surprised'
	},
	stage: LearningLoopStage,
	text: { id, en }
};
