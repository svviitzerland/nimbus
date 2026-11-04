import CloudServicesStage from '$lib/components/stages/CloudServicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const services: Lesson = {
	id: 'services',
	mood: 'thinking',
	moods: ['thinking', 'thinking', 'calm', 'happy', 'idea', 'wink', 'idea'],
	reactionMood: { open: 'excited' },
	stage: CloudServicesStage,
	text: { id, en }
};
