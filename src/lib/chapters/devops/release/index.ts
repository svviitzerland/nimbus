import ReleaseStage from '$lib/components/stages/ReleaseStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const release: Lesson = {
	id: 'release',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		bigbang: 'sad',
		slowBack: 'worried',
		flipped: 'surprised',
		flipBack: 'happy',
		canary: 'thinking',
		canaryBig: 'worried',
		canaryBack: 'happy',
		both: 'excited'
	},
	stage: ReleaseStage,
	text: { id, en }
};
