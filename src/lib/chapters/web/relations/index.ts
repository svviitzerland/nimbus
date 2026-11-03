import RelationsStage from '$lib/components/stages/RelationsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const relations: Lesson = {
	id: 'relations',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'calm', 'wink', 'happy'],
	reactionMood: {
		customer: 'happy',
		product: 'happy',
		wrong: 'thinking',
		follow: 'idea',
		joined: 'excited'
	},
	stage: RelationsStage,
	text: { id, en }
};
