import NeuralNetStage from '$lib/components/stages/NeuralNetStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const neuralNet: Lesson = {
	id: 'neural-net',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'idea',
		'thinking',
		'idea',
		'happy',
		'thinking',
		'excited',
		'wink',
		'happy'
	],
	reactionMood: {
		select: 'idea',
		tweak: 'thinking',
		worse: 'surprised',
		better: 'happy'
	},
	stage: NeuralNetStage,
	text: { id, en }
};
