import ApiStage from '$lib/components/stages/ApiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const api: Lesson = {
	id: 'api',
	mood: 'calm',
	moods: ['calm', 'calm', 'idea', 'thinking', 'happy'],
	reactionMood: { fetch: 'happy' },
	stage: ApiStage,
	text: { id, en }
};
