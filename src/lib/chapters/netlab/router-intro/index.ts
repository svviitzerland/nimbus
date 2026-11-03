import RouterIntroStage from '$lib/components/stages/RouterIntroStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const routerIntro: Lesson = {
	id: 'router-intro',
	mood: 'thinking',
	moods: ['calm', 'happy', 'idea', 'thinking', 'thinking', 'wink', 'happy'],
	reactionMood: {
		identity: 'happy',
		otherName: 'wink',
		interfaces: 'idea',
		address: 'happy',
		wrongPort: 'thinking',
		badAddress: 'thinking',
		addrPrint: 'happy',
		error: 'surprised',
		done: 'excited'
	},
	stage: RouterIntroStage,
	text: { id, en }
};
