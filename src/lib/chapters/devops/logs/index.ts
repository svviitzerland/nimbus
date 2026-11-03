import LogsStage from '$lib/components/stages/LogsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const logs: Lesson = {
	id: 'logs',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'wink', 'thinking'],
	reactionMood: {
		peek: 'worried',
		handFound: 'thinking',
		search: 'idea',
		found: 'excited'
	},
	stage: LogsStage,
	text: { id, en }
};
