import MobileAppsStage from '$lib/components/stages/MobileAppsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mobileApps: Lesson = {
	id: 'mobile-apps',
	mood: 'thinking',
	moods: ['happy', 'thinking', 'idea', 'calm', 'excited', 'wink', 'happy'],
	reactionMood: {
		native: 'thinking',
		cross: 'idea',
		web: 'happy',
		game: 'excited',
		startup: 'happy',
		menu: 'wink',
		miss: 'thinking'
	},
	stage: MobileAppsStage,
	text: { id, en }
};
