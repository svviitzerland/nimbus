import InferenceStage from '$lib/components/stages/InferenceStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const inference: Lesson = {
	id: 'inference',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		training: 'thinking',
		trained: 'happy',
		ask: 'excited',
		typed: 'wink',
		rush: 'excited'
	},
	playable: true,
	stage: InferenceStage,
	text: { id, en }
};
