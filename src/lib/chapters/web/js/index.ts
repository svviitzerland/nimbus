import JsStage from '$lib/components/stages/JsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const js: Lesson = {
	id: 'js',
	mood: 'calm',
	moods: [
		'thinking',
		'idea',
		'calm',
		'idea',
		'excited',
		'wink',
		'worried',
		'happy',
		'idea',
		'excited'
	],
	reactionMood: { tap: 'happy', step: 'excited' },
	stage: JsStage,
	text: { id, en }
};
