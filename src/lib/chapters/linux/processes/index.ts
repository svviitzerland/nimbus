import ProcessesStage from '$lib/components/stages/ProcessesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const processes: Lesson = {
	id: 'processes',
	mood: 'thinking',
	moods: ['calm', 'idea', 'surprised', 'thinking', 'excited', 'happy', 'wink', 'idea', 'happy'],
	reactionMood: {
		killed: 'excited',
		killed9: 'surprised',
		ignored: 'thinking',
		listed: 'happy',
		top: 'idea',
		background: 'wink',
		jobs: 'happy',
		pid1: 'wink',
		noProcess: 'thinking',
		needSudo: 'wink',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: ProcessesStage,
	text: { id, en }
};
