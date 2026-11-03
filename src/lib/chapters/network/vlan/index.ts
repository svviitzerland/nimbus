import VlanStage from '$lib/components/stages/VlanStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vlan: Lesson = {
	id: 'vlan',
	mood: 'thinking',
	moods: ['worried', 'thinking', 'idea', 'idea', 'wink', 'happy'],
	reactionMood: {
		leak: 'worried',
		reach: 'happy',
		split: 'idea',
		blocked: 'happy',
		oops: 'surprised',
		done: 'excited'
	},
	stage: VlanStage,
	text: { id, en }
};
