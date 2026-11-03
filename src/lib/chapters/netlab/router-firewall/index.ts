import RouterFirewallStage from '$lib/components/stages/RouterFirewallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerFirewall: Lesson = {
	id: 'router-firewall',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'thinking', 'wink', 'happy'],
	reactionMood: {
		added: 'happy',
		mismatch: 'thinking',
		moved: 'idea',
		gameOpen: 'thinking',
		overBlock: 'surprised',
		winboxOpen: 'worried',
		order: 'idea',
		lockedOut: 'surprised',
		allPass: 'happy',
		done: 'excited'
	},
	stage: RouterFirewallStage,
	text: { id, en }
};
