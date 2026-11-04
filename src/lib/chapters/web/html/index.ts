import HtmlStage from '$lib/components/stages/HtmlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const html: Lesson = {
	id: 'html',
	mood: 'calm',
	moods: [
		'calm',
		'thinking',
		'idea',
		'calm',
		'happy',
		'happy',
		'happy',
		'idea',
		'excited',
		'wink',
		'excited'
	],
	reactionMood: {
		edited: 'excited',
		unclosed: 'thinking'
	},
	stage: HtmlStage,
	text: { id, en }
};
