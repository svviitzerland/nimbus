import BinaryStage from '$lib/components/stages/BinaryStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const binary: Lesson = {
	id: 'binary',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'wink',
		'thinking',
		'happy',
		'wink',
		'surprised',
		'idea',
		'thinking',
		'wink',
		'excited'
	],
	reactionMood: { flip: 'surprised', letter: 'excited' },
	stage: BinaryStage,
	text: { id, en }
};
