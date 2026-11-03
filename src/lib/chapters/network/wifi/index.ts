import WifiStage from '$lib/components/stages/WifiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wifi: Lesson = {
	id: 'wifi',
	mood: 'happy',
	moods: ['happy', 'thinking', 'worried', 'wink', 'excited'],
	reactionMood: {
		near5: 'excited',
		weak5: 'worried',
		through24: 'happy',
		clash: 'surprised',
		clear: 'wink'
	},
	stage: WifiStage,
	text: { id, en }
};
