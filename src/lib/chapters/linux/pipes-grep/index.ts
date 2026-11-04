import PipesGrepStage from '$lib/components/stages/PipesGrepStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const pipesGrep: Lesson = {
	id: 'pipes-grep',
	mood: 'thinking',
	moods: ['worried', 'thinking', 'idea', 'excited', 'happy', 'wink', 'calm', 'idea', 'happy'],
	reactionMood: {
		server: 'excited',
		counted404: 'happy',
		counted: 'happy',
		piped: 'idea',
		grepped: 'happy',
		noMatch: 'thinking',
		read: 'surprised',
		nano: 'wink',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: PipesGrepStage,
	text: { id, en }
};
