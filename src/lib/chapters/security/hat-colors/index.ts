import HatColorsStage from '$lib/components/stages/HatColorsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hatColors: Lesson = {
	id: 'hat-colors',
	mood: 'thinking',
	moods: [
		'wink',
		'idea',
		'happy',
		'worried',
		'thinking',
		'surprised',
		'calm',
		'wink',
		'excited',
		'happy'
	],
	reactionMood: {
		white: 'happy',
		gray: 'thinking',
		black: 'sad'
	},
	stage: HatColorsStage,
	text: { id, en }
};
