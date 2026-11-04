import IncidentStage from '$lib/components/stages/IncidentStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const incident: Lesson = {
	id: 'incident',
	mood: 'worried',
	moods: [
		'surprised',
		'wink',
		'calm',
		'thinking',
		'worried',
		'idea',
		'happy',
		'calm',
		'idea',
		'wink'
	],
	reactionMood: { skip: 'worried', right: 'happy' },
	stage: IncidentStage,
	text: { id, en }
};
