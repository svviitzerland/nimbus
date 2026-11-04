import SniffingStage from '$lib/components/stages/SniffingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sniffing: Lesson = {
	id: 'sniffing',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'happy', 'surprised', 'idea', 'wink', 'excited'],
	reactionMood: {
		http: 'worried',
		https: 'happy'
	},
	stage: SniffingStage,
	text: { id, en }
};
