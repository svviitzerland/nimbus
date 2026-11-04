import CompilerStage from '$lib/components/stages/CompilerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const compiler: Lesson = {
	id: 'compiler',
	mood: 'thinking',
	moods: [
		'thinking',
		'idea',
		'calm',
		'calm',
		'excited',
		'surprised',
		'happy',
		'wink',
		'thinking',
		'idea',
		'excited'
	],
	reactionMood: { typo: 'surprised', fixed: 'happy' },
	stage: CompilerStage,
	text: { id, en }
};
