import MobileAppsStage from '$lib/components/stages/MobileAppsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mobileApps: Lesson = {
	id: 'mobile-apps',
	mood: 'happy',
	moods: ['happy', 'thinking', 'calm', 'idea', 'excited', 'thinking', 'wink', 'idea', 'happy'],
	reactionMood: { feature: 'wink' },
	stage: MobileAppsStage,
	text: { id, en }
};
