import BuildToolsStage from '$lib/components/stages/BuildToolsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const buildTools: Lesson = {
	id: 'build-tools',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		none: 'thinking',
		partial: 'happy',
		best: 'excited',
		peek: 'surprised'
	},
	playable: true,
	stage: BuildToolsStage,
	text: { id, en }
};
