import AiEthicsStage from '$lib/components/stages/AiEthicsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiEthics: Lesson = {
	id: 'ai-ethics',
	mood: 'calm',
	moods: ['happy', 'thinking', 'worried', 'thinking', 'wink', 'idea'],
	reactionMood: {
		news: 'happy',
		news_wrong: 'wink',
		cv: 'happy',
		cv_wrong: 'thinking',
		key: 'happy',
		key_wrong: 'worried',
		friend: 'happy',
		friend_wrong: 'worried',
		art: 'idea',
		art_wrong: 'thinking',
		bank: 'happy',
		bank_wrong: 'surprised',
		done: 'excited'
	},
	playable: true,
	stage: AiEthicsStage,
	text: { id, en }
};
