import HistoryStage from '$lib/components/stages/HistoryStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const history: Lesson = {
	id: 'history',
	mood: 'happy',
	moods: [
		'calm',
		'surprised',
		'idea',
		'thinking',
		'calm',
		'surprised',
		'idea',
		'happy',
		'thinking',
		'happy',
		'excited',
		'wink',
		'wink',
		'excited'
	],
	reactionMood: { peek: 'happy' },
	stage: HistoryStage,
	text: { id, en }
};
