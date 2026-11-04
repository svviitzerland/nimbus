import PermissionsStage from '$lib/components/stages/PermissionsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const permissions: Lesson = {
	id: 'permissions',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'thinking',
		'surprised',
		'happy',
		'idea',
		'wink',
		'thinking',
		'wink',
		'happy'
	],
	reactionMood: {
		locked: 'excited',
		chmod: 'happy',
		risky: 'worried',
		ran: 'happy',
		sudo: 'wink',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: PermissionsStage,
	text: { id, en }
};
