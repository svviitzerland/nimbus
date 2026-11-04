import AgentsStage from '$lib/components/stages/AgentsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const agents: Lesson = {
	id: 'agents',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'thinking',
		'thinking',
		'surprised',
		'wink',
		'excited',
		'wink',
		'idea',
		'happy'
	],
	reactionMood: { allow: 'happy', deny: 'calm' },
	stage: AgentsStage,
	text: { id, en }
};
