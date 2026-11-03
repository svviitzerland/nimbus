import IacStage from '$lib/components/stages/IacStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const iac: Lesson = {
	id: 'iac',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		hand: 'thinking',
		handLost: 'sad',
		applied: 'happy',
		diff: 'idea',
		rebuilt: 'excited'
	},
	stage: IacStage,
	text: { id, en }
};
