import RoutingStage from '$lib/components/stages/RoutingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routing: Lesson = {
	id: 'routing',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		noRoute: 'surprised',
		added: 'happy',
		wrongWay: 'thinking',
		delivered: 'excited',
		deleted: 'wink',
		lost: 'sad'
	},
	playable: true,
	stage: RoutingStage,
	text: { id, en }
};
