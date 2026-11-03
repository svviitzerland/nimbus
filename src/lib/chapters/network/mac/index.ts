import MacStage from '$lib/components/stages/MacStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mac: Lesson = {
	id: 'mac',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'idea', 'idea', 'thinking', 'happy', 'wink', 'excited'],
	reactionMood: {
		reply: 'happy',
		print: 'excited',
		tv: 'happy',
		nobody: 'surprised',
		cached: 'wink'
	},
	stage: MacStage,
	text: { id, en }
};
