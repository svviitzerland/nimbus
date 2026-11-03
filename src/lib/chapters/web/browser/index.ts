import BrowserStage from '$lib/components/stages/BrowserStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const browser: Lesson = {
	id: 'browser',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'calm', 'happy', 'wink', 'excited'],
	reactionMood: {
		html: 'thinking',
		css: 'happy',
		img: 'happy',
		js: 'excited',
		deadbutton: 'thinking',
		liked: 'happy',
		nocss: 'surprised',
		nojs: 'wink',
		again: 'calm'
	},
	stage: BrowserStage,
	text: { id, en }
};
