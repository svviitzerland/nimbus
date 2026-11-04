import DynamicRoutingStage from '$lib/components/stages/DynamicRoutingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dynamicRouting: Lesson = {
	id: 'dynamic-routing',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'happy', 'wink', 'thinking', 'surprised', 'worried', 'happy'],
	reactionMood: {
		withdraw: 'worried',
		announce: 'happy'
	},
	stage: DynamicRoutingStage,
	text: { id, en }
};
