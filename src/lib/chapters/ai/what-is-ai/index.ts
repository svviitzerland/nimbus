import WhatIsAiStage from '$lib/components/stages/WhatIsAiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whatIsAi: Lesson = {
	id: 'what-is-ai',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'surprised', 'excited', 'wink', 'happy'],
	reactionMood: {
		calc: 'calm',
		chess: 'thinking',
		spam: 'happy',
		face: 'excited',
		chat: 'excited',
		image: 'happy'
	},
	stage: WhatIsAiStage,
	text: { id, en }
};
