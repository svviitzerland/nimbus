import UiUxStage from '$lib/components/stages/UiUxStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const uiUx: Lesson = {
	id: 'ui-ux',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'wink', 'happy', 'excited'],
	reactionMood: {
		trap: 'surprised',
		paidA: 'worried',
		paidB: 'happy',
		both: 'excited',
		why: 'idea'
	},
	stage: UiUxStage,
	text: { id, en }
};
