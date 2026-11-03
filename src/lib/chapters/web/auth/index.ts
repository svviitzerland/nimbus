import AuthStage from '$lib/components/stages/AuthStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const auth: Lesson = {
	id: 'auth',
	mood: 'calm',
	moods: ['wink', 'idea', 'thinking', 'calm', 'calm', 'wink', 'excited'],
	reactionMood: {
		login: 'happy',
		browse: 'happy',
		deleted: 'thinking',
		kicked: 'surprised',
		stranger: 'thinking',
		token: 'idea',
		tokenBrowse: 'happy',
		tokenKicked: 'surprised'
	},
	stage: AuthStage,
	text: { id, en }
};
