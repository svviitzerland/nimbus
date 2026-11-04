import LanguagesStage from '$lib/components/stages/LanguagesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const languages: Lesson = {
	id: 'languages',
	mood: 'calm',
	moods: [
		'calm',
		'surprised',
		'idea',
		'thinking',
		'happy',
		'thinking',
		'wink',
		'wink',
		'idea',
		'excited'
	],
	reactionMood: {
		machine: 'surprised',
		c: 'thinking',
		python: 'happy'
	},
	stage: LanguagesStage,
	text: { id, en }
};
