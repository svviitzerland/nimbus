import LogsStage from '$lib/components/stages/LogsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const logs: Lesson = {
	id: 'logs',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'surprised', 'thinking', 'excited', 'wink', 'idea', 'happy'],
	reactionMood: {
		error: 'excited',
		checkout: 'thinking',
		slow: 'idea'
	},
	stage: LogsStage,
	text: { id, en }
};
