import DhcpStage from '$lib/components/stages/DhcpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dhcp: Lesson = {
	id: 'dhcp',
	mood: 'calm',
	moods: ['wink', 'idea', 'happy', 'thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		dora: 'happy',
		empty: 'worried',
		leave: 'thinking',
		rejoin: 'excited'
	},
	playable: true,
	stage: DhcpStage,
	text: { id, en }
};
