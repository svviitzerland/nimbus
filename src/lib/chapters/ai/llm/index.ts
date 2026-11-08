import LlmStage from '$lib/components/stages/LlmStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const llm: Lesson = {
	id: 'llm',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'surprised', 'thinking', 'wink', 'excited'],
	reactionMood: {
		typed: 'thinking',
		pick: 'happy',
		cold: 'calm',
		hot: 'surprised',
		surprise: 'wink',
		done: 'excited'
	},
	playable: true,
	stage: LlmStage,
	text: { id, en }
};
