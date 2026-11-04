import VlanStage from '$lib/components/stages/VlanStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vlan: Lesson = {
	id: 'vlan',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'happy', 'happy', 'wink', 'thinking', 'idea', 'happy'],
	reactionMood: {
		joined: 'worried',
		left: 'happy'
	},
	stage: VlanStage,
	text: { id, en }
};
