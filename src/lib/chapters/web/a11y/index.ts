import A11yStage from '$lib/components/stages/A11yStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const a11y: Lesson = {
	id: 'a11y',
	mood: 'calm',
	moods: [
		'thinking',
		'worried',
		'happy',
		'happy',
		'excited',
		'calm',
		'idea',
		'wink',
		'idea',
		'excited'
	],
	reactionMood: { blind: 'surprised' },
	stage: A11yStage,
	text: { id, en }
};
