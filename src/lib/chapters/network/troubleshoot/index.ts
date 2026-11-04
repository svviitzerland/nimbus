import TroubleshootStage from '$lib/components/stages/TroubleshootStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const troubleshoot: Lesson = {
	id: 'troubleshoot',
	mood: 'thinking',
	moods: ['worried', 'idea', 'surprised', 'thinking', 'idea', 'happy', 'wink', 'thinking', 'happy'],
	reactionMood: {
		start: 'thinking',
		ok: 'happy',
		skip: 'surprised',
		solved: 'excited'
	},
	stage: TroubleshootStage,
	text: { id, en }
};
