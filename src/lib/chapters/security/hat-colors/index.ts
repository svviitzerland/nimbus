import HatColorsStage from '$lib/components/stages/HatColorsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hatColors: Lesson = {
	id: 'hat-colors',
	mood: 'thinking',
	moods: ['wink', 'idea', 'thinking', 'surprised', 'calm', 'happy', 'excited'],
	reactionMood: {
		lab: 'happy',
		wifi: 'thinking',
		pentest: 'excited',
		extort: 'sad',
		warn: 'worried',
		bounty: 'excited'
	},
	stage: HatColorsStage,
	text: { id, en }
};
