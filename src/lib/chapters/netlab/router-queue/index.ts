import RouterQueueStage from '$lib/components/stages/RouterQueueStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerQueue: Lesson = {
	id: 'router-queue',
	mood: 'thinking',
	moods: ['worried', 'thinking', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		torch: 'idea',
		wrongUser: 'thinking',
		tooHarsh: 'surprised',
		notYet: 'thinking',
		fair: 'excited',
		tuned: 'happy',
		noQueue: 'thinking',
		stats: 'happy',
		error: 'surprised',
		done: 'excited'
	},
	stage: RouterQueueStage,
	text: { id, en }
};
