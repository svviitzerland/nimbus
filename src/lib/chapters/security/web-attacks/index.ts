import WebAttacksStage from '$lib/components/stages/WebAttacksStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const webAttacks: Lesson = {
	id: 'web-attacks',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'surprised',
		'excited',
		'worried',
		'happy',
		'idea',
		'wink',
		'excited'
	],
	reactionMood: {
		fixOff: 'worried',
		fixOn: 'excited'
	},
	stage: WebAttacksStage,
	text: { id, en }
};
