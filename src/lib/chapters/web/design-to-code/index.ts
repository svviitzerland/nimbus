import DesignToCodeStage from '$lib/components/stages/DesignToCodeStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const designToCode: Lesson = {
	id: 'design-to-code',
	mood: 'calm',
	moods: ['calm', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		inspect: 'idea',
		color: 'happy',
		radius: 'happy',
		padding: 'happy',
		font: 'happy',
		done: 'excited'
	},
	stage: DesignToCodeStage,
	text: { id, en }
};
