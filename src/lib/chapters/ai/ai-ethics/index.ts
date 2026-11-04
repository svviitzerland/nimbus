import AiEthicsStage from '$lib/components/stages/AiEthicsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiEthics: Lesson = {
	id: 'ai-ethics',
	mood: 'calm',
	moods: ['calm', 'thinking', 'wink', 'happy', 'idea', 'worried', 'thinking', 'idea', 'happy'],
	reactionMood: { news: 'happy', cv: 'idea', friend: 'worried' },
	stage: AiEthicsStage,
	text: { id, en }
};
