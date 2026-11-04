import PwaStage from '$lib/components/stages/PwaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const pwa: Lesson = {
	id: 'pwa',
	mood: 'calm',
	moods: [
		'calm',
		'sad',
		'idea',
		'thinking',
		'happy',
		'excited',
		'surprised',
		'wink',
		'idea',
		'happy'
	],
	reactionMood: { offline: 'excited', online: 'happy' },
	stage: PwaStage,
	text: { id, en }
};
