import RouterIntroStage from '$lib/components/stages/RouterIntroStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerIntro: Lesson = {
	id: 'router-intro',
	mood: 'thinking',
	moods: ['calm', 'happy', 'wink', 'idea', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		addrPrint: 'happy',
		interfaces: 'idea',
		identity: 'wink',
		error: 'thinking'
	},
	stage: RouterIntroStage,
	text: { id, en }
};
