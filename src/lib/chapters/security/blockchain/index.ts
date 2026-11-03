import BlockchainStage from '$lib/components/stages/BlockchainStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const blockchain: Lesson = {
	id: 'blockchain',
	mood: 'calm',
	moods: ['calm', 'idea', 'thinking', 'surprised', 'calm', 'wink', 'thinking', 'happy'],
	reactionMood: {
		broken: 'surprised',
		tip: 'thinking',
		restored: 'happy',
		rehash: 'wink',
		synced: 'happy'
	},
	stage: BlockchainStage,
	text: { id, en }
};
