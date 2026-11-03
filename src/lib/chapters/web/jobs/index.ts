import JobsStage from '$lib/components/stages/JobsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const jobs: Lesson = {
	id: 'jobs',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		slow: 'worried',
		fast: 'excited',
		rush: 'surprised',
		workers: 'happy',
		drained: 'happy'
	},
	stage: JobsStage,
	text: { id, en }
};
