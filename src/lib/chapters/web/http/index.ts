import HttpStage from '$lib/components/stages/HttpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const http: Lesson = {
	id: 'http',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'calm', 'thinking', 'wink', 'wink', 'excited'],
	reactionMood: {
		ok: 'happy',
		list: 'happy',
		created: 'excited',
		notfound: 'thinking',
		notallowed: 'surprised',
		broken: 'worried',
		done: 'excited'
	},
	playable: true,
	stage: HttpStage,
	text: { id, en }
};
