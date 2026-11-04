import LlmStage from '$lib/components/stages/LlmStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const llm: Lesson = {
	id: 'llm',
	mood: 'thinking',
	moods: [
		'calm',
		'surprised',
		'thinking',
		'idea',
		'excited',
		'wink',
		'worried',
		'idea',
		'thinking',
		'happy'
	],
	reactionMood: {
		roll: 'happy',
		surprise: 'wink'
	},
	stage: LlmStage,
	text: { id, en }
};
