import SupervisedStage from '$lib/components/stages/SupervisedStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const supervised: Lesson = {
	id: 'supervised',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'surprised', 'wink', 'happy', 'excited'],
	reactionMood: {
		again: 'happy'
	},
	stage: SupervisedStage,
	text: { id, en }
};
