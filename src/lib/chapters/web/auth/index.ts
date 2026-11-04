import AuthStage from '$lib/components/stages/AuthStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const auth: Lesson = {
	id: 'auth',
	mood: 'calm',
	moods: [
		'wink',
		'thinking',
		'idea',
		'calm',
		'happy',
		'idea',
		'wink',
		'thinking',
		'surprised',
		'excited'
	],
	reactionMood: { deleted: 'surprised', login: 'happy' },
	stage: AuthStage,
	text: { id, en }
};
