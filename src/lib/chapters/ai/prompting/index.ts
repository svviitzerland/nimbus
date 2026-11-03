import PromptingStage from '$lib/components/stages/PromptingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const prompting: Lesson = {
	id: 'prompting',
	mood: 'idea',
	moods: ['calm', 'wink', 'idea', 'thinking', 'idea', 'happy', 'excited'],
	reactionMood: {
		vague: 'surprised',
		miss_task: 'thinking',
		miss_audience: 'thinking',
		miss_format: 'thinking',
		miss_example: 'wink',
		perfect: 'excited'
	},
	stage: PromptingStage,
	text: { id, en }
};
