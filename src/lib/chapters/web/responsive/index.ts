import ResponsiveStage from '$lib/components/stages/ResponsiveStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const responsive: Lesson = {
	id: 'responsive',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'happy', 'excited', 'wink', 'idea', 'happy'],
	reactionMood: { drag: 'happy' },
	stage: ResponsiveStage,
	text: { id, en }
};
