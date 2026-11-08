import KeysStage from '$lib/components/stages/KeysStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const keys: Lesson = {
	id: 'keys',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'worried', 'surprised', 'idea', 'excited', 'wink', 'happy'],
	reactionMood: {
		symKey: 'worried',
		symRead: 'sad',
		padlock: 'idea',
		sealed: 'excited',
		multiply: 'happy',
		factor1: 'happy',
		factor2: 'thinking',
		factor3: 'surprised'
	},
	playable: true,
	stage: KeysStage,
	text: { id, en }
};
