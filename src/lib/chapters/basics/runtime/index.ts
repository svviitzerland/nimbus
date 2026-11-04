import RuntimeStage from '$lib/components/stages/RuntimeStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const runtime: Lesson = {
	id: 'runtime',
	mood: 'calm',
	moods: [
		'thinking',
		'idea',
		'calm',
		'wink',
		'happy',
		'excited',
		'surprised',
		'idea',
		'worried',
		'excited'
	],
	reactionMood: { noRuntime: 'surprised', runtime: 'happy' },
	stage: RuntimeStage,
	text: { id, en }
};
