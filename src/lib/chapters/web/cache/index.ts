import CacheStage from '$lib/components/stages/CacheStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cache: Lesson = {
	id: 'cache',
	mood: 'calm',
	moods: [
		'thinking',
		'worried',
		'idea',
		'calm',
		'thinking',
		'excited',
		'wink',
		'surprised',
		'happy'
	],
	reactionMood: {
		miss: 'thinking',
		hit: 'excited'
	},
	stage: CacheStage,
	text: { id, en }
};
