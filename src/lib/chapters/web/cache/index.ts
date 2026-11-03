import CacheStage from '$lib/components/stages/CacheStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cache: Lesson = {
	id: 'cache',
	mood: 'calm',
	moods: ['thinking', 'worried', 'idea', 'calm', 'happy', 'wink', 'excited'],
	reactionMood: {
		slow: 'worried',
		miss: 'thinking',
		hit: 'excited',
		stale: 'surprised',
		fresh: 'happy'
	},
	stage: CacheStage,
	text: { id, en }
};
