import SsoStage from '$lib/components/stages/SsoStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sso: Lesson = {
	id: 'sso',
	mood: 'thinking',
	moods: ['worried', 'idea', 'surprised', 'calm', 'idea', 'wink', 'excited'],
	reactionMood: {
		redirect: 'idea',
		google: 'happy',
		consent: 'excited',
		greedy: 'worried',
		revoke: 'wink'
	},
	stage: SsoStage,
	text: { id, en }
};
