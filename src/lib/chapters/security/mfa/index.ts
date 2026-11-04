import MfaStage from '$lib/components/stages/MfaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mfa: Lesson = {
	id: 'mfa',
	mood: 'thinking',
	moods: [
		'worried',
		'sad',
		'idea',
		'wink',
		'calm',
		'excited',
		'happy',
		'surprised',
		'worried',
		'excited'
	],
	reactionMood: {
		you: 'happy',
		wrongCode: 'thinking'
	},
	stage: MfaStage,
	text: { id, en }
};
