import HtmlStage from '$lib/components/stages/HtmlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const html: Lesson = {
	id: 'html',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'calm', 'happy', 'wink', 'excited'],
	reactionMood: {
		heading: 'happy',
		paragraph: 'happy',
		button: 'excited',
		image: 'happy',
		link: 'wink',
		unclosed: 'thinking',
		done: 'excited'
	},
	stage: HtmlStage,
	text: { id, en }
};
