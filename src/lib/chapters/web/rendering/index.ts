import RenderingStage from '$lib/components/stages/RenderingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const rendering: Lesson = {
	id: 'rendering',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'idea', 'wink', 'excited'],
	reactionMood: {
		csr: 'worried',
		ssr: 'happy',
		ssg: 'excited',
		all: 'idea',
		fast: 'wink'
	},
	stage: RenderingStage,
	text: { id, en }
};
