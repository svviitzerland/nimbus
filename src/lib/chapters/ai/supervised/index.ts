import SupervisedStage from '$lib/components/stages/SupervisedStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const supervised: Lesson = {
	id: 'supervised',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		sup_guess: 'happy',
		unsup_mode: 'thinking',
		unsup_go: 'idea',
		found3: 'excited',
		foundk: 'wink'
	},
	stage: SupervisedStage,
	text: { id, en }
};
