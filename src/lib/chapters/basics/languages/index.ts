import LanguagesStage from '$lib/components/stages/LanguagesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const languages: Lesson = {
	id: 'languages',
	mood: 'calm',
	moods: ['calm', 'surprised', 'thinking', 'idea', 'wink', 'happy', 'excited'],
	reactionMood: {
		machine: 'surprised',
		c: 'thinking',
		python: 'happy',
		data: 'happy',
		web: 'wink',
		fast: 'excited',
		wrong: 'thinking'
	},
	playable: true,
	stage: LanguagesStage,
	text: { id, en }
};
