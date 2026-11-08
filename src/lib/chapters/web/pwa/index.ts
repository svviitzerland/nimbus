import PwaStage from '$lib/components/stages/PwaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const pwa: Lesson = {
	id: 'pwa',
	mood: 'happy',
	moods: ['thinking', 'idea', 'calm', 'idea', 'surprised', 'excited'],
	reactionMood: {
		plainOffline: 'sad',
		manifest: 'happy',
		worker: 'idea',
		installed: 'wink',
		offlineApp: 'excited'
	},
	playable: true,
	stage: PwaStage,
	text: { id, en }
};
