import DevicesStage from '$lib/components/stages/DevicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const devices: Lesson = {
	id: 'devices',
	mood: 'calm',
	moods: ['calm', 'idea', 'happy', 'happy', 'wink', 'idea', 'thinking', 'excited'],
	reactionMood: {
		noModem: 'worried',
		noRouter: 'sad',
		noSwitch: 'surprised',
		noAp: 'thinking',
		fixed: 'happy'
	},
	stage: DevicesStage,
	text: { id, en }
};
