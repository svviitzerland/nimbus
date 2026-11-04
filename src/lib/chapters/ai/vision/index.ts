import VisionStage from '$lib/components/stages/VisionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vision: Lesson = {
	id: 'vision',
	mood: 'happy',
	moods: [
		'happy',
		'surprised',
		'thinking',
		'idea',
		'thinking',
		'excited',
		'wink',
		'idea',
		'calm',
		'excited'
	],
	reactionMood: {
		cat: 'happy',
		fish: 'happy',
		house: 'excited'
	},
	stage: VisionStage,
	text: { id, en }
};
