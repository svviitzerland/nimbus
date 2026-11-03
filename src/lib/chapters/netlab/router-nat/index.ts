import RouterNatStage from '$lib/components/stages/RouterNatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerNat: Lesson = {
	id: 'router-nat',
	mood: 'thinking',
	moods: ['thinking', 'worried', 'idea', 'thinking', 'happy', 'wink', 'happy'],
	reactionMood: {
		noNet: 'worried',
		noNetAgain: 'thinking',
		masq: 'happy',
		srcnat: 'wink',
		wrongChain: 'thinking',
		wrongOut: 'surprised',
		wrongAction: 'thinking',
		loaded: 'excited',
		shared: 'happy',
		conntrack: 'idea',
		noConn: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: RouterNatStage,
	text: { id, en }
};
