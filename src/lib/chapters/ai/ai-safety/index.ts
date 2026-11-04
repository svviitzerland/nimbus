import AiSafetyStage from '$lib/components/stages/AiSafetyStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiSafety: Lesson = {
	id: 'ai-safety',
	mood: 'calm',
	moods: [
		'calm',
		'surprised',
		'thinking',
		'wink',
		'thinking',
		'worried',
		'idea',
		'thinking',
		'happy'
	],
	reactionMood: { off: 'worried', on: 'excited' },
	stage: AiSafetyStage,
	text: { id, en }
};
