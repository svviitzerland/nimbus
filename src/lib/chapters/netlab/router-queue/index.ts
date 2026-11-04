import RouterQueueStage from '$lib/components/stages/RouterQueueStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerQueue: Lesson = {
	id: 'router-queue',
	mood: 'thinking',
	moods: ['worried', 'thinking', 'idea', 'idea', 'excited', 'happy', 'wink', 'calm', 'happy'],
	reactionMood: {
		queuePrint: 'happy',
		torch: 'idea',
		error: 'thinking'
	},
	stage: RouterQueueStage,
	text: { id, en }
};
