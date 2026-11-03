import NetworkStage from '$lib/components/stages/NetworkStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vpc: Lesson = {
	id: 'vpc',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'idea', 'happy'],
	reactionMood: { web: 'happy', blocked: 'excited' },
	stage: NetworkStage,
	text: { id, en }
};
