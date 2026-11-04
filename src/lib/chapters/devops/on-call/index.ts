import OnCallStage from '$lib/components/stages/OnCallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const onCall: Lesson = {
	id: 'on-call',
	mood: 'thinking',
	moods: [
		'calm',
		'worried',
		'thinking',
		'idea',
		'thinking',
		'happy',
		'wink',
		'idea',
		'calm',
		'wink'
	],
	reactionMood: {
		panic: 'worried'
	},
	stage: OnCallStage,
	text: { id, en }
};
