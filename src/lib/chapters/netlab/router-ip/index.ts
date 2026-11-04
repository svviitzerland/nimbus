import RouterIpStage from '$lib/components/stages/RouterIpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerIp: Lesson = {
	id: 'router-ip',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'thinking', 'excited', 'wink', 'happy', 'happy'],
	reactionMood: {
		leases: 'happy',
		pool: 'idea',
		error: 'thinking'
	},
	stage: RouterIpStage,
	text: { id, en }
};
