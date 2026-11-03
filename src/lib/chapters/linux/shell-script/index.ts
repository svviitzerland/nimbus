import ShellScriptStage from '$lib/components/stages/ShellScriptStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const shellScript: Lesson = {
	id: 'shell-script',
	mood: 'happy',
	moods: ['sad', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		mkdir: 'happy',
		hand: 'thinking',
		handAgain: 'sad',
		write: 'happy',
		saved: 'happy',
		order: 'thinking',
		chmod: 'happy',
		exec: 'happy',
		runDenied: 'wink',
		brokenRun: 'thinking',
		emptyDay: 'surprised',
		bashRun: 'wink',
		ran: 'excited',
		run: 'excited',
		again: 'excited',
		nextDay: 'happy',
		nextDayHand: 'sad',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: ShellScriptStage,
	text: { id, en }
};
