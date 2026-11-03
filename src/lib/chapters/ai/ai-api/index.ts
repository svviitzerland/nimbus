import AiApiStage from '$lib/components/stages/AiApiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiApi: Lesson = {
	id: 'ai-api',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'surprised', 'wink', 'excited'],
	reactionMood: {
		model: 'idea',
		sent: 'happy',
		nokey: 'worried',
		compare: 'excited'
	},
	stage: AiApiStage,
	text: { id, en }
};
