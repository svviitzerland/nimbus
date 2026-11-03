import PermissionsStage from '$lib/components/stages/PermissionsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const permissions: Lesson = {
	id: 'permissions',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'wink', 'idea', 'happy'],
	reactionMood: {
		listed: 'idea',
		runDenied: 'surprised',
		chmodX: 'happy',
		ran: 'excited',
		bashTrick: 'wink',
		confDenied: 'thinking',
		sudo: 'happy',
		notOwner: 'thinking',
		risky: 'worried',
		othersWrite: 'worried',
		chmod: 'happy',
		undo: 'happy',
		rmrf: 'surprised',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: PermissionsStage,
	text: { id, en }
};
