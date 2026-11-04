import TransactionStage from '$lib/components/stages/TransactionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const transaction: Lesson = {
	id: 'transaction',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'happy', 'wink', 'thinking', 'excited'],
	reactionMood: {
		off: 'sad',
		on: 'happy'
	},
	stage: TransactionStage,
	text: { id, en }
};
