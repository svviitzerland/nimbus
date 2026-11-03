import ResponsiveStage from '$lib/components/stages/ResponsiveStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const responsive: Lesson = {
	id: 'responsive',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'calm', 'wink', 'excited'],
	reactionMood: {
		phone: 'happy',
		tablet: 'happy',
		laptop: 'excited',
		fixed: 'worried',
		done: 'excited'
	},
	stage: ResponsiveStage,
	text: { id, en }
};
