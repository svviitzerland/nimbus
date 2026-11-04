import RouterNatStage from '$lib/components/stages/RouterNatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerNat: Lesson = {
	id: 'router-nat',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'excited', 'thinking', 'wink', 'idea', 'happy'],
	reactionMood: {
		natPrint: 'happy',
		conntrack: 'idea',
		error: 'thinking'
	},
	stage: RouterNatStage,
	text: { id, en }
};
