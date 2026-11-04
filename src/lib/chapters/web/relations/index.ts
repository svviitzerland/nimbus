import RelationsStage from '$lib/components/stages/RelationsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const relations: Lesson = {
	id: 'relations',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'happy', 'wink', 'idea', 'wink', 'excited'],
	reactionMood: {
		rename: 'excited',
		back: 'happy'
	},
	stage: RelationsStage,
	text: { id, en }
};
