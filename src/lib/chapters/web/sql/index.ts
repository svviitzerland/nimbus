import SqlStage from '$lib/components/stages/SqlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sql: Lesson = {
	id: 'sql',
	mood: 'calm',
	moods: ['thinking', 'calm', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		all: 'happy',
		pick: 'wink',
		out: 'idea',
		cheap: 'excited',
		miss: 'thinking',
		done: 'excited'
	},
	stage: SqlStage,
	text: { id, en }
};
