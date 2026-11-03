import DevicesStage from '$lib/components/stages/DevicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const devices: Lesson = {
	id: 'devices',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'happy', 'wink', 'excited'],
	reactionMood: {
		modem: 'idea',
		router: 'happy',
		switch: 'happy',
		ap: 'wink',
		wrong: 'thinking',
		built: 'excited',
		noModem: 'worried',
		noRouter: 'sad',
		noSwitch: 'surprised',
		noAp: 'thinking',
		fixed: 'happy'
	},
	stage: DevicesStage,
	text: { id, en }
};
