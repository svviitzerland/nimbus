import RouterHotspotStage from '$lib/components/stages/RouterHotspotStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerHotspot: Lesson = {
	id: 'router-hotspot',
	mood: 'thinking',
	moods: [
		'happy',
		'thinking',
		'idea',
		'excited',
		'happy',
		'excited',
		'surprised',
		'wink',
		'idea',
		'happy'
	],
	reactionMood: {
		users: 'happy',
		active: 'idea',
		error: 'thinking'
	},
	stage: RouterHotspotStage,
	text: { id, en }
};
