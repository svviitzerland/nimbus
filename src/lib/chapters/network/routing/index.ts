import RoutingStage from '$lib/components/stages/RoutingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routing: Lesson = {
	id: 'routing',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'idea', 'happy', 'wink', 'thinking', 'idea', 'happy'],
	reactionMood: {
		knocked: 'surprised',
		fixed: 'happy'
	},
	stage: RoutingStage,
	text: { id, en }
};
