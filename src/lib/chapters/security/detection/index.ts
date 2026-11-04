import DetectionStage from '$lib/components/stages/DetectionStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const detection: Lesson = {
	id: 'detection',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'worried', 'idea', 'wink', 'sad', 'idea', 'excited'],
	reactionMood: { innocent: 'calm', found: 'excited' },
	stage: DetectionStage,
	text: { id, en }
};
