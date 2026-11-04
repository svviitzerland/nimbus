import KeysStage from '$lib/components/stages/KeysStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const keys: Lesson = {
	id: 'keys',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'thinking',
		'worried',
		'surprised',
		'idea',
		'wink',
		'thinking',
		'surprised',
		'happy'
	],
	reactionMood: {
		shared: 'worried',
		padlock: 'excited'
	},
	stage: KeysStage,
	text: { id, en }
};
