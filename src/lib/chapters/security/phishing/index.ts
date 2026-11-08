import PhishingStage from '$lib/components/stages/PhishingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const phishing: Lesson = {
	id: 'phishing',
	mood: 'thinking',
	moods: ['calm', 'worried', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: {
		peek: 'idea',
		invoiceRight: 'happy',
		invoiceWrong: 'wink',
		lookalikeRight: 'excited',
		lookalikeWrong: 'surprised',
		resetRight: 'excited',
		resetWrong: 'worried',
		bossRight: 'happy',
		bossWrong: 'worried',
		signinRight: 'idea',
		signinWrong: 'thinking',
		done: 'excited'
	},
	playable: true,
	stage: PhishingStage,
	text: { id, en }
};
