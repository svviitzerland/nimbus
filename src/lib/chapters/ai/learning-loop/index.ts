import LearningLoopStage from '$lib/components/stages/LearningLoopStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const learningLoop: Lesson = {
	id: 'learning-loop',
	mood: 'thinking',
	moods: ['happy', 'thinking', 'calm', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		step: 'happy',
		small: 'worried',
		zigzag: 'surprised',
		big: 'worried',
		flew: 'surprised',
		slow: 'thinking',
		bottom: 'excited'
	},
	stage: LearningLoopStage,
	text: { id, en }
};
