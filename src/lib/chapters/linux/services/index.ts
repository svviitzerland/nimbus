import ServicesStage from '$lib/components/stages/ServicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const services: Lesson = {
	id: 'services',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'happy', 'wink', 'excited'],
	reactionMood: {
		status: 'thinking',
		started: 'happy',
		startedAgain: 'happy',
		restarted: 'happy',
		crashed: 'surprised',
		revived: 'excited',
		revivedAgain: 'happy',
		nothingToCrash: 'wink',
		statusRestarting: 'idea',
		stopped: 'calm',
		enabled: 'happy',
		disabled: 'thinking',
		rebooting: 'worried',
		bootDown: 'sad',
		bootIdle: 'thinking',
		boot: 'excited',
		bootAgain: 'happy',
		journal: 'idea',
		unitFile: 'idea',
		needSudo: 'wink',
		noUnit: 'thinking',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: ServicesStage,
	text: { id, en }
};
