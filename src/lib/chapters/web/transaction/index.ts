import TransactionStage from '$lib/components/stages/TransactionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const transaction: Lesson = {
	id: 'transaction',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		ok: 'calm',
		vanish: 'sad',
		commit: 'happy',
		rollback: 'excited'
	},
	stage: TransactionStage,
	text: { id, en }
};
