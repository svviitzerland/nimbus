import LinuxFilesStage from '$lib/components/stages/LinuxFilesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const linuxFiles: Lesson = {
	id: 'linux-files',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'happy', 'excited', 'surprised', 'wink', 'idea', 'happy'],
	reactionMood: {
		home: 'excited',
		moved: 'happy',
		looked: 'idea',
		read: 'happy',
		pwd: 'wink',
		rootHome: 'wink',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: LinuxFilesStage,
	text: { id, en }
};
