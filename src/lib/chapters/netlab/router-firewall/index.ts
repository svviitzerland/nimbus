import RouterFirewallStage from '$lib/components/stages/RouterFirewallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerFirewall: Lesson = {
	id: 'router-firewall',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'thinking', 'wink', 'happy', 'idea', 'surprised', 'happy'],
	reactionMood: {
		filterPrint: 'happy',
		error: 'thinking'
	},
	stage: RouterFirewallStage,
	text: { id, en }
};
