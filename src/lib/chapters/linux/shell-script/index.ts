import ShellScriptStage from '$lib/components/stages/ShellScriptStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const shellScript: Lesson = {
	id: 'shell-script',
	mood: 'happy',
	moods: ['sad', 'idea', 'thinking', 'wink', 'happy', 'excited', 'wink', 'idea', 'happy'],
	reactionMood: {
		ran: 'excited',
		bashRun: 'wink',
		chmod: 'happy',
		chmodOff: 'thinking',
		read: 'happy',
		runDenied: 'thinking',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised'
	},
	stage: ShellScriptStage,
	text: { id, en }
};
