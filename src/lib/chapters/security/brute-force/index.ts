import BruteForceStage from '$lib/components/stages/BruteForceStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const bruteForce: Lesson = {
	id: 'brute-force',
	mood: 'thinking',
	moods: ['calm', 'worried', 'surprised', 'idea', 'thinking', 'excited'],
	reactionMood: {
		leaked: 'sad',
		leakedLock: 'worried',
		fast: 'worried',
		medium: 'thinking',
		strong: 'excited',
		lockOn: 'happy'
	},
	stage: BruteForceStage,
	text: { id, en }
};
