import EmbeddingsStage from '$lib/components/stages/EmbeddingsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const embeddings: Lesson = {
	id: 'embeddings',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'happy', 'calm', 'excited', 'idea', 'wink', 'happy'],
	reactionMood: {
		puppy: 'happy',
		queen: 'happy',
		noodles: 'wink',
		nimbus: 'excited'
	},
	stage: EmbeddingsStage,
	text: { id, en }
};
