import BackendFrameworksStage from '$lib/components/stages/BackendFrameworksStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backendFrameworks: Lesson = {
	id: 'backend-frameworks',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		route: 'calm',
		read: 'thinking',
		validate: 'thinking',
		security: 'worried',
		db: 'thinking',
		respond: 'happy',
		byhand: 'surprised',
		laravel: 'happy',
		express: 'wink',
		django: 'happy',
		spring: 'idea'
	},
	playable: true,
	stage: BackendFrameworksStage,
	text: { id, en }
};
