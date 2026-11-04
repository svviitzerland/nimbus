import HttpStage from '$lib/components/stages/HttpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const http: Lesson = {
	id: 'http',
	mood: 'calm',
	moods: [
		'calm',
		'thinking',
		'idea',
		'thinking',
		'calm',
		'happy',
		'thinking',
		'wink',
		'idea',
		'excited'
	],
	reactionMood: {
		ok: 'happy',
		moved: 'wink',
		notfound: 'thinking',
		broken: 'worried'
	},
	stage: HttpStage,
	text: { id, en }
};
