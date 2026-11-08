import WebAttacksStage from '$lib/components/stages/WebAttacksStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const webAttacks: Lesson = {
	id: 'web-attacks',
	mood: 'thinking',
	moods: ['calm', 'worried', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: {
		normal: 'happy',
		wrong: 'calm',
		broken: 'surprised',
		sqlIn: 'worried',
		drop: 'sad',
		sqlBlocked: 'excited',
		plain: 'happy',
		htmlTag: 'thinking',
		xssRan: 'worried',
		xssBlocked: 'excited'
	},
	playable: true,
	stage: WebAttacksStage,
	text: { id, en }
};
