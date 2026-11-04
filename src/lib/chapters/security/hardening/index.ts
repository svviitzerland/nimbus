import HardeningStage from '$lib/components/stages/HardeningStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hardening: Lesson = {
	id: 'hardening',
	mood: 'thinking',
	moods: [
		'surprised',
		'worried',
		'thinking',
		'sad',
		'idea',
		'wink',
		'happy',
		'calm',
		'idea',
		'excited'
	],
	reactionMood: { reopen: 'worried', reclose: 'happy' },
	stage: HardeningStage,
	text: { id, en }
};
