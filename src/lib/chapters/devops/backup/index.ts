import BackupStage from '$lib/components/stages/BackupStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backup: Lesson = {
	id: 'backup',
	mood: 'thinking',
	moods: [
		'calm',
		'worried',
		'idea',
		'happy',
		'thinking',
		'wink',
		'idea',
		'excited',
		'surprised',
		'happy'
	],
	reactionMood: {
		daily: 'sad',
		hourly: 'happy'
	},
	stage: BackupStage,
	text: { id, en }
};
