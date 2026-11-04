import DhcpStage from '$lib/components/stages/DhcpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dhcp: Lesson = {
	id: 'dhcp',
	mood: 'calm',
	moods: [
		'wink',
		'idea',
		'thinking',
		'happy',
		'happy',
		'excited',
		'thinking',
		'wink',
		'idea',
		'happy'
	],
	reactionMood: {
		join: 'happy',
		empty: 'worried'
	},
	stage: DhcpStage,
	text: { id, en }
};
