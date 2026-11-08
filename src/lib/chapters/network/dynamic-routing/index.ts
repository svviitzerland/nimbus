import DynamicRoutingStage from '$lib/components/stages/DynamicRoutingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dynamicRouting: Lesson = {
	id: 'dynamic-routing',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'idea', 'surprised', 'happy'],
	reactionMood: {
		rerouted: 'excited',
		sameRoad: 'wink',
		restoredLink: 'happy',
		noPath: 'worried',
		bgpAct: 'thinking',
		tryOk: 'happy',
		backbone: 'surprised',
		withdraw: 'worried',
		tryFail: 'sad',
		onsite: 'thinking',
		restored: 'happy'
	},
	playable: true,
	stage: DynamicRoutingStage,
	text: { id, en }
};
