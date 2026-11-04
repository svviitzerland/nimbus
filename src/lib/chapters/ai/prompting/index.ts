import PromptingStage from '$lib/components/stages/PromptingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const prompting: Lesson = {
	id: 'prompting',
	mood: 'idea',
	moods: ['calm', 'surprised', 'idea', 'happy', 'wink', 'excited', 'idea', 'wink', 'happy'],
	reactionMood: {
		off_task: 'surprised',
		off_context: 'thinking',
		off_format: 'thinking',
		off_example: 'wink',
		back: 'happy',
		full: 'excited'
	},
	stage: PromptingStage,
	text: { id, en }
};
