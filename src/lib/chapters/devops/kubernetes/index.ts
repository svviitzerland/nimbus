import KubernetesStage from '$lib/components/stages/KubernetesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const kubernetes: Lesson = {
	id: 'kubernetes',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		healed: 'happy',
		healed2: 'excited',
		scaledUp: 'idea',
		scaledDown: 'calm',
		nodeDown: 'surprised',
		nodeBack: 'happy'
	},
	stage: KubernetesStage,
	text: { id, en }
};
