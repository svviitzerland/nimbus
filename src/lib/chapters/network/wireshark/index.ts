import WiresharkStage from '$lib/components/stages/WiresharkStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wireshark: Lesson = {
	id: 'wireshark',
	mood: 'thinking',
	moods: ['calm', 'surprised', 'idea', 'happy', 'wink', 'thinking', 'happy'],
	reactionMood: {
		dns: 'thinking',
		tcp: 'idea',
		hello: 'thinking',
		data: 'excited'
	},
	stage: WiresharkStage,
	text: { id, en }
};
