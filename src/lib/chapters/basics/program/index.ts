import ProgramStage from '$lib/components/stages/ProgramStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const program: Lesson = {
	id: 'program',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'thinking',
		'surprised',
		'happy',
		'thinking',
		'wink',
		'idea',
		'wink',
		'excited'
	],
	reactionMood: {
		spill: 'surprised',
		fixed: 'happy'
	},
	stage: ProgramStage,
	text: { id, en }
};
