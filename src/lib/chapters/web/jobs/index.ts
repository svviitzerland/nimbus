import JobsStage from '$lib/components/stages/JobsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const jobs: Lesson = {
	id: 'jobs',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'happy', 'wink', 'thinking', 'calm', 'excited'],
	reactionMood: { w1: 'calm', w2: 'happy', w3: 'excited' },
	stage: JobsStage,
	text: { id, en }
};
