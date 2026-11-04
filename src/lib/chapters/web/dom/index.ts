import DomStage from '$lib/components/stages/DomStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dom: Lesson = {
	id: 'dom',
	mood: 'calm',
	moods: [
		'calm',
		'thinking',
		'idea',
		'surprised',
		'calm',
		'excited',
		'idea',
		'wink',
		'idea',
		'happy'
	],
	reactionMood: { bubble: 'excited' },
	stage: DomStage,
	text: { id, en }
};
