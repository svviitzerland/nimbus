import BlockchainStage from '$lib/components/stages/BlockchainStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const blockchain: Lesson = {
	id: 'blockchain',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'thinking',
		'surprised',
		'wink',
		'happy',
		'thinking',
		'idea',
		'calm',
		'happy'
	],
	reactionMood: {
		broken: 'surprised',
		restored: 'happy'
	},
	stage: BlockchainStage,
	text: { id, en }
};
