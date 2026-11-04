import MacStage from '$lib/components/stages/MacStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mac: Lesson = {
	id: 'mac',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'wink', 'thinking', 'happy', 'excited', 'idea', 'wink'],
	reactionMood: {
		nobody: 'surprised'
	},
	stage: MacStage,
	text: { id, en }
};
