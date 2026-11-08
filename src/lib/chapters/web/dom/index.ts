import DomStage from '$lib/components/stages/DomStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dom: Lesson = {
	id: 'dom',
	mood: 'calm',
	moods: ['calm', 'idea', 'surprised', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: {
		found: 'happy',
		bubble: 'excited',
		miss: 'thinking',
		grow: 'excited',
		anywhere: 'wink'
	},
	playable: true,
	stage: DomStage,
	text: { id, en }
};
