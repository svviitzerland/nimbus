import HardwareStage from '$lib/components/stages/HardwareStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hardware: Lesson = {
	id: 'hardware',
	mood: 'happy',
	moods: [
		'happy',
		'surprised',
		'idea',
		'thinking',
		'calm',
		'calm',
		'excited',
		'wink',
		'happy',
		'calm',
		'idea',
		'excited'
	],
	reactionMood: { peek: 'happy' },
	stage: HardwareStage,
	text: { id, en }
};
