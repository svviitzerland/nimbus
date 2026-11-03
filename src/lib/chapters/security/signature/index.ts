import SignatureStage from '$lib/components/stages/SignatureStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const signature: Lesson = {
	id: 'signature',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'thinking', 'calm', 'happy', 'wink', 'excited'],
	reactionMood: {
		fingerprint: 'idea',
		signed: 'happy',
		verified: 'excited',
		edit: 'wink',
		untouched: 'thinking',
		tampered: 'surprised',
		forged: 'happy'
	},
	stage: SignatureStage,
	text: { id, en }
};
