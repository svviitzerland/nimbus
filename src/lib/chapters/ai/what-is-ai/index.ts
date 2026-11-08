import WhatIsAiStage from '$lib/components/stages/WhatIsAiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whatIsAi: Lesson = {
	id: 'what-is-ai',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'excited', 'surprised', 'happy', 'wink', 'excited'],
	reactionMood: {
		calc: 'happy',
		chess: 'happy',
		spam: 'excited',
		price: 'happy',
		face: 'excited',
		chat: 'excited',
		image: 'happy',
		calc_wrong: 'thinking',
		chess_wrong: 'thinking',
		spam_wrong: 'thinking',
		price_wrong: 'thinking',
		face_wrong: 'thinking',
		chat_wrong: 'thinking',
		image_wrong: 'thinking'
	},
	playable: true,
	stage: WhatIsAiStage,
	text: { id, en }
};
