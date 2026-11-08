import DdosStage from '$lib/components/stages/DdosStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ddos: Lesson = {
	id: 'ddos',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'surprised', 'wink', 'idea'],
	reactionMood: {
		flood: 'worried',
		rateWin: 'happy',
		rateLose: 'thinking',
		cdnWin: 'happy',
		cdnLose: 'thinking',
		down: 'worried',
		holding: 'wink',
		saved: 'excited'
	},
	playable: true,
	stage: DdosStage,
	text: { id, en }
};
