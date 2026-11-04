import RagStage from '$lib/components/stages/RagStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const rag: Lesson = {
	id: 'rag',
	mood: 'thinking',
	moods: [
		'calm',
		'surprised',
		'worried',
		'idea',
		'thinking',
		'thinking',
		'happy',
		'idea',
		'wink',
		'excited'
	],
	reactionMood: {
		longer: 'excited',
		shorter: 'happy'
	},
	stage: RagStage,
	text: { id, en }
};
