import RouterHotspotStage from '$lib/components/stages/RouterHotspotStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerHotspot: Lesson = {
	id: 'router-hotspot',
	mood: 'happy',
	moods: ['happy', 'idea', 'thinking', 'thinking', 'wink', 'happy'],
	reactionMood: {
		setup: 'excited',
		wizardBad: 'thinking',
		noHotspot: 'worried',
		portal: 'idea',
		badLogin: 'thinking',
		usedUp: 'wink',
		voucher: 'happy',
		otherLimit: 'wink',
		noLimit: 'thinking',
		online: 'excited',
		onlineNoLimit: 'thinking',
		neverEnds: 'surprised',
		expired: 'wink',
		active: 'happy',
		noActive: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: RouterHotspotStage,
	text: { id, en }
};
