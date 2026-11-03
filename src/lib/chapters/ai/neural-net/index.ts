import NeuralNetStage from '$lib/components/stages/NeuralNetStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const neuralNet: Lesson = {
	id: 'neural-net',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'thinking', 'wink', 'happy', 'excited'],
	reactionMood: {
		input: 'happy',
		select: 'idea',
		tweak: 'thinking',
		better: 'happy',
		worse: 'surprised',
		hand: 'excited',
		learning: 'thinking',
		trained: 'excited'
	},
	stage: NeuralNetStage,
	text: { id, en }
};
