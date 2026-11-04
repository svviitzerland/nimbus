import SqlStage from '$lib/components/stages/SqlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sql: Lesson = {
	id: 'sql',
	mood: 'calm',
	moods: [
		'calm',
		'thinking',
		'idea',
		'happy',
		'thinking',
		'wink',
		'surprised',
		'idea',
		'wink',
		'excited'
	],
	reactionMood: {
		all: 'happy',
		pick: 'wink',
		out: 'idea',
		cheap: 'excited'
	},
	stage: SqlStage,
	text: { id, en }
};
