import A11yStage from '$lib/components/stages/A11yStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const a11y: Lesson = {
	id: 'a11y',
	mood: 'calm',
	moods: ['thinking', 'calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		blind: 'surprised',
		alt: 'happy',
		label: 'happy',
		button: 'excited',
		contrast: 'happy',
		done: 'excited'
	},
	stage: A11yStage,
	text: { id, en }
};
