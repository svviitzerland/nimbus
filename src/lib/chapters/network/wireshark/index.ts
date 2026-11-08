import WiresharkStage from '$lib/components/stages/WiresharkStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wireshark: Lesson = {
	id: 'wireshark',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		capture: 'surprised',
		dns: 'thinking',
		tcp: 'idea',
		hello: 'thinking',
		data: 'excited'
	},
	playable: true,
	stage: WiresharkStage,
	text: { id, en }
};
