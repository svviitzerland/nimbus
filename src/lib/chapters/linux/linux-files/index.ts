import LinuxFilesStage from '$lib/components/stages/LinuxFilesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const linuxFiles: Lesson = {
	id: 'linux-files',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'wink', 'happy', 'worried'],
	reactionMood: {
		pwd: 'happy',
		root: 'idea',
		varlog: 'excited',
		found: 'surprised',
		etc: 'idea',
		hostname: 'happy',
		access: 'thinking',
		notes: 'wink',
		rootHome: 'wink',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: LinuxFilesStage,
	text: { id, en }
};
