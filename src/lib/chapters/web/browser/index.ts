import BrowserStage from '$lib/components/stages/BrowserStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const browser: Lesson = {
	id: 'browser',
	mood: 'calm',
	moods: [
		'calm',
		'thinking',
		'idea',
		'calm',
		'happy',
		'happy',
		'excited',
		'wink',
		'idea',
		'excited'
	],
	reactionMood: {
		nocss: 'surprised',
		cssback: 'happy'
	},
	stage: BrowserStage,
	text: { id, en }
};
