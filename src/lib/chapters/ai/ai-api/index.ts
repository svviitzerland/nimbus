import AiApiStage from '$lib/components/stages/AiApiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiApi: Lesson = {
	id: 'ai-api',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'thinking',
		'wink',
		'thinking',
		'happy',
		'surprised',
		'idea',
		'wink',
		'excited'
	],
	reactionMood: { long: 'surprised', short: 'happy' },
	stage: AiApiStage,
	text: { id, en }
};
