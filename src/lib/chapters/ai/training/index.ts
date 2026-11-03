import TrainingStage from '$lib/components/stages/TrainingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const training: Lesson = {
	id: 'training',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		label: 'happy',
		ready: 'excited',
		trained: 'idea',
		right: 'happy',
		wrong: 'surprised',
		done: 'excited'
	},
	stage: TrainingStage,
	text: { id, en }
};
