import BackendWhatStage from '$lib/components/stages/BackendWhatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backendWhat: Lesson = {
	id: 'backend-what',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'calm', 'wink', 'excited'],
	reactionMood: {
		login: 'thinking',
		rejected: 'worried',
		stock: 'thinking',
		save: 'happy',
		email: 'happy',
		done: 'excited'
	},
	stage: BackendWhatStage,
	text: { id, en }
};
