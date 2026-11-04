import BuildToolsStage from '$lib/components/stages/BuildToolsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const buildTools: Lesson = {
	id: 'build-tools',
	mood: 'calm',
	moods: [
		'calm',
		'worried',
		'idea',
		'happy',
		'thinking',
		'happy',
		'calm',
		'wink',
		'idea',
		'excited'
	],
	reactionMood: { off: 'worried', on: 'happy' },
	stage: BuildToolsStage,
	text: { id, en }
};
