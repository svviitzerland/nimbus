import AiCloudStage from '$lib/components/stages/AiCloudStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiCloud: Lesson = {
	id: 'ai-cloud',
	mood: 'thinking',
	moods: ['excited', 'idea', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		grow: 'surprised',
		budget: 'worried',
		cache: 'happy',
		small: 'thinking',
		route: 'idea',
		fixed: 'excited'
	},
	playable: true,
	stage: AiCloudStage,
	text: { id, en }
};
