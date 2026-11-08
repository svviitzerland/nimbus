import AiSafetyStage from '$lib/components/stages/AiSafetyStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const aiSafety: Lesson = {
	id: 'ai-safety',
	mood: 'thinking',
	moods: ['calm', 'surprised', 'worried', 'thinking', 'idea', 'excited'],
	reactionMood: {
		checked: 'thinking',
		caught: 'excited',
		hijacked: 'surprised',
		nodefense: 'worried',
		revealed: 'idea',
		decoy: 'wink',
		onelayer: 'thinking',
		safe: 'happy'
	},
	playable: true,
	stage: AiSafetyStage,
	text: { id, en }
};
