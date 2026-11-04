import GpuStage from '$lib/components/stages/GpuStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const gpu: Lesson = {
	id: 'gpu',
	mood: 'happy',
	moods: ['thinking', 'calm', 'idea', 'excited', 'wink', 'happy', 'idea', 'thinking'],
	reactionMood: {
		chain: 'surprised',
		pile: 'excited'
	},
	stage: GpuStage,
	text: { id, en }
};
