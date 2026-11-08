import RagStage from '$lib/components/stages/RagStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const rag: Lesson = {
	id: 'rag',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		plain_refund: 'worried',
		plain_support: 'surprised',
		rag_refund: 'happy',
		rag_support: 'happy',
		edit: 'idea',
		edit_rag: 'excited'
	},
	playable: true,
	stage: RagStage,
	text: { id, en }
};
