import DdosStage from '$lib/components/stages/DdosStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ddos: Lesson = {
	id: 'ddos',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'surprised', 'idea', 'happy', 'wink', 'excited', 'calm'],
	reactionMood: {
		shieldOff: 'worried',
		shieldOn: 'excited'
	},
	stage: DdosStage,
	text: { id, en }
};
