import PackagesStage from '$lib/components/stages/PackagesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const packages: Lesson = {
	id: 'packages',
	mood: 'happy',
	moods: ['thinking', 'idea', 'happy', 'excited', 'surprised', 'happy', 'wink', 'idea', 'happy'],
	reactionMood: {
		installed: 'excited',
		other: 'happy',
		already: 'wink',
		updated: 'happy',
		removed: 'calm',
		ran: 'happy',
		notInstalled: 'idea',
		needSudo: 'wink',
		noPackage: 'thinking',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: PackagesStage,
	text: { id, en }
};
