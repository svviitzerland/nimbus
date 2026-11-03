import PingStage from '$lib/components/stages/PingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ping: Lesson = {
	id: 'ping',
	mood: 'thinking',
	moods: ['worried', 'idea', 'wink', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		ping: 'happy',
		pingRouter: 'idea',
		trace: 'excited',
		unknown: 'surprised',
		error: 'thinking',
		done: 'excited'
	},
	stage: PingStage,
	text: { id, en }
};
