import BinaryStage from '$lib/components/stages/BinaryStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const binary: Lesson = {
	id: 'binary',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'idea', 'wink', 'surprised', 'excited'],
	reactionMood: {
		letter: 'excited',
		word: 'happy',
		char: 'happy',
		chat: 'calm',
		photo: 'surprised',
		song: 'thinking',
		movie: 'surprised'
	},
	stage: BinaryStage,
	text: { id, en }
};
