import OnCallStage from '$lib/components/stages/OnCallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const onCall: Lesson = {
	id: 'on-call',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'surprised'],
	reactionMood: {
		ack: 'happy',
		panic: 'worried',
		dash: 'thinking',
		change: 'idea',
		rollback: 'excited',
		resolved: 'happy',
		blame: 'sad',
		postmortem: 'excited'
	},
	playable: true,
	stage: OnCallStage,
	text: { id, en }
};
