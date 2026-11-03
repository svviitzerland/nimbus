import RuntimeStage from '$lib/components/stages/RuntimeStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const runtime: Lesson = {
	id: 'runtime',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'worried', 'excited'],
	reactionMood: {
		noRuntime: 'surprised',
		runtime: 'happy',
		scratch: 'worried',
		library: 'excited',
		built: 'happy',
		broke: 'sad',
		pinned: 'wink'
	},
	stage: RuntimeStage,
	text: { id, en }
};
