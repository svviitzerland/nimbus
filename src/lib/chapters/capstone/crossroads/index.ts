import BranchStage from '$lib/components/stages/BranchStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

/** The end of Dari Nol, where the learner branches out into one track to go deeper. */
export const crossroads: Lesson = {
	id: 'crossroads',
	mood: 'excited',
	moods: ['excited', 'idea', 'happy'],
	reactionMood: {
		network: 'idea',
		web: 'happy',
		cloud: 'excited',
		security: 'wink',
		ai: 'excited'
	},
	stage: BranchStage,
	text: { id, en }
};
