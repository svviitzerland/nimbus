import TroubleshootStage from '$lib/components/stages/TroubleshootStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const troubleshoot: Lesson = {
	id: 'troubleshoot',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: {
		ok: 'happy',
		fail: 'thinking',
		skip: 'wink',
		wrong: 'surprised',
		solved: 'excited'
	},
	stage: TroubleshootStage,
	text: { id, en }
};
