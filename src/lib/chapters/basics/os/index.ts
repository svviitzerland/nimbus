import OsStage from '$lib/components/stages/OsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const os: Lesson = {
	id: 'os',
	mood: 'thinking',
	moods: [
		'thinking',
		'idea',
		'wink',
		'calm',
		'excited',
		'happy',
		'worried',
		'calm',
		'happy',
		'excited'
	],
	reactionMood: { open: 'happy', slow: 'worried', close: 'happy' },
	stage: OsStage,
	text: { id, en }
};
