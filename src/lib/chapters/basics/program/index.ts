import ProgramStage from '$lib/components/stages/ProgramStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const program: Lesson = {
	id: 'program',
	mood: 'calm',
	moods: ['calm', 'thinking', 'surprised', 'idea', 'wink', 'thinking', 'excited'],
	reactionMood: {
		spill: 'surprised',
		empty: 'thinking',
		plain: 'worried',
		cold: 'sad',
		tea: 'excited'
	},
	playable: true,
	stage: ProgramStage,
	text: { id, en }
};
