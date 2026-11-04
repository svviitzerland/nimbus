import ServicesStage from '$lib/components/stages/ServicesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const services: Lesson = {
	id: 'services',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'happy', 'surprised', 'happy', 'wink', 'idea', 'happy'],
	reactionMood: {
		restarted: 'excited',
		started: 'happy',
		stopped: 'calm',
		status: 'thinking',
		enabled: 'happy',
		disabled: 'thinking',
		crashed: 'surprised',
		nothingToCrash: 'wink',
		needSudo: 'wink',
		noUnit: 'thinking',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: ServicesStage,
	text: { id, en }
};
