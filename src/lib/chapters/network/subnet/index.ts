import SubnetStage from '$lib/components/stages/SubnetStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const subnet: Lesson = {
	id: 'subnet',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		split: 'idea',
		tiny: 'surprised',
		small: 'worried',
		waste: 'thinking',
		m1: 'happy',
		m2: 'happy',
		done: 'excited'
	},
	playable: true,
	stage: SubnetStage,
	text: { id, en }
};
