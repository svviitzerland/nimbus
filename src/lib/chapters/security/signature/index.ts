import SignatureStage from '$lib/components/stages/SignatureStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const signature: Lesson = {
	id: 'signature',
	mood: 'thinking',
	moods: [
		'thinking',
		'calm',
		'idea',
		'wink',
		'surprised',
		'calm',
		'happy',
		'worried',
		'idea',
		'happy'
	],
	reactionMood: {
		clean: 'happy',
		tampered: 'surprised'
	},
	stage: SignatureStage,
	text: { id, en }
};
