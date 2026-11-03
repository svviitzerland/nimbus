import VisionStage from '$lib/components/stages/VisionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vision: Lesson = {
	id: 'vision',
	mood: 'happy',
	moods: ['happy', 'thinking', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		draw: 'happy',
		loop: 'surprised',
		line: 'happy',
		cross: 'happy',
		box: 'happy',
		ring: 'happy',
		clear: 'calm',
		done: 'excited'
	},
	stage: VisionStage,
	text: { id, en }
};
