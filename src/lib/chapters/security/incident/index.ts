import IncidentStage from '$lib/components/stages/IncidentStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const incident: Lesson = {
	id: 'incident',
	mood: 'worried',
	moods: ['surprised', 'worried', 'idea', 'thinking', 'calm', 'excited'],
	reactionMood: {
		check: 'thinking',
		contain: 'happy',
		clean: 'idea',
		recover: 'happy',
		doneGood: 'excited',
		doneSlow: 'wink',
		wrongContain: 'thinking',
		wrongClean: 'worried',
		wrongRecover: 'sad',
		wrongLearn: 'worried',
		pay: 'sad',
		hide: 'surprised'
	},
	playable: true,
	stage: IncidentStage,
	text: { id, en }
};
