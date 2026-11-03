import DetectionStage from '$lib/components/stages/DetectionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const detection: Lesson = {
	id: 'detection',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'worried', 'idea', 'sad', 'wink'],
	reactionMood: {
		search: 'happy',
		innocent: 'thinking',
		found: 'excited',
		siem: 'wink'
	},
	stage: DetectionStage,
	text: { id, en }
};
