import CodeBasicsStage from '$lib/components/stages/CodeBasicsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const codeBasics: Lesson = {
	id: 'code-basics',
	mood: 'calm',
	moods: [
		'calm',
		'wink',
		'idea',
		'thinking',
		'happy',
		'thinking',
		'idea',
		'excited',
		'wink',
		'happy'
	],
	reactionMood: { call: 'excited', plain: 'surprised' },
	stage: CodeBasicsStage,
	text: { id, en }
};
