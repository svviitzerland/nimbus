import AgentsStage from '$lib/components/stages/AgentsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const agents: Lesson = {
	id: 'agents',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'thinking', 'wink', 'happy', 'excited'],
	reactionMood: {
		think: 'thinking',
		tool: 'idea',
		result: 'happy',
		busy: 'surprised',
		ask: 'wink',
		allow: 'happy',
		deny: 'calm',
		email: 'excited',
		done: 'excited',
		done_deny: 'calm',
		auto: 'wink'
	},
	stage: AgentsStage,
	text: { id, en }
};
