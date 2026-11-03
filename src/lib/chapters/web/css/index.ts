import CssStage from '$lib/components/stages/CssStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const css: Lesson = {
	id: 'css',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'calm', 'wink', 'excited'],
	reactionMood: {
		background: 'happy',
		color: 'happy',
		font: 'idea',
		button: 'excited',
		typo: 'thinking',
		center: 'wink',
		done: 'excited'
	},
	stage: CssStage,
	text: { id, en }
};
