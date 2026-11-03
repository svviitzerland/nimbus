import RouterIpStage from '$lib/components/stages/RouterIpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerIp: Lesson = {
	id: 'router-ip',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		noIp: 'worried',
		gotIp: 'excited',
		pool: 'happy',
		poolBad: 'thinking',
		network: 'happy',
		gatewayBad: 'thinking',
		server: 'excited',
		wizard: 'excited',
		wizardBad: 'thinking',
		disabled: 'wink',
		wrongPort: 'surprised',
		noPool: 'thinking',
		noLease: 'thinking',
		leases: 'happy',
		error: 'surprised',
		done: 'excited'
	},
	stage: RouterIpStage,
	text: { id, en }
};
