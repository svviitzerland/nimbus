import KubernetesStage from '$lib/components/stages/KubernetesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const kubernetes: Lesson = {
	id: 'kubernetes',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'happy', 'surprised', 'wink', 'calm', 'excited'],
	reactionMood: { healed: 'happy' },
	stage: KubernetesStage,
	text: { id, en }
};
