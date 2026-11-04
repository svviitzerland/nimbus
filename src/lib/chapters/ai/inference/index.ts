import InferenceStage from '$lib/components/stages/InferenceStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const inference: Lesson = {
	id: 'inference',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'happy', 'excited', 'wink', 'wink', 'excited'],
	reactionMood: {
		ask: 'excited'
	},
	stage: InferenceStage,
	text: { id, en }
};
