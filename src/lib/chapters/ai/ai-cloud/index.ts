import AiCloudStage from '$lib/components/stages/AiCloudStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiCloud: Lesson = {
	id: 'ai-cloud',
	mood: 'calm',
	moods: ['happy', 'thinking', 'excited', 'worried', 'idea', 'idea', 'wink', 'thinking', 'happy'],
	reactionMood: { off: 'worried', on: 'excited' },
	stage: AiCloudStage,
	text: { id, en }
};
