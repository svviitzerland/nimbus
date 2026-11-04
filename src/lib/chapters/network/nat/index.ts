import NatStage from '$lib/components/stages/NatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const nat: Lesson = {
	id: 'nat',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'thinking', 'happy', 'excited', 'wink', 'idea', 'wink'],
	reactionMood: {
		stranger: 'wink'
	},
	stage: NatStage,
	text: { id, en }
};
