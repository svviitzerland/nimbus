import BackupStage from '$lib/components/stages/BackupStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backup: Lesson = {
	id: 'backup',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'wink', 'idea', 'excited'],
	reactionMood: {
		daily: 'sad',
		hourly: 'happy',
		rule: 'idea',
		fireLost: 'worried',
		fireSafe: 'excited'
	},
	playable: true,
	stage: BackupStage,
	text: { id, en }
};
