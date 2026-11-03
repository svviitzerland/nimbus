import EmbeddingsStage from '$lib/components/stages/EmbeddingsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const embeddings: Lesson = {
	id: 'embeddings',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'wink', 'thinking', 'excited'],
	reactionMood: {
		select: 'idea',
		wrong: 'thinking',
		puppy: 'happy',
		queen: 'happy',
		noodles: 'happy',
		nimbus: 'wink',
		all: 'excited'
	},
	stage: EmbeddingsStage,
	text: { id, en }
};
