import PhishingStage from '$lib/components/stages/PhishingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const phishing: Lesson = {
	id: 'phishing',
	mood: 'thinking',
	moods: [
		'calm',
		'worried',
		'thinking',
		'idea',
		'surprised',
		'thinking',
		'wink',
		'calm',
		'excited'
	],
	reactionMood: {
		fake: 'worried',
		real: 'happy'
	},
	stage: PhishingStage,
	text: { id, en }
};
