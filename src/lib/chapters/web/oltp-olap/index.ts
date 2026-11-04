import OltpOlapStage from '$lib/components/stages/OltpOlapStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const oltpOlap: Lesson = {
	id: 'oltp-olap',
	mood: 'calm',
	moods: [
		'calm',
		'excited',
		'worried',
		'idea',
		'thinking',
		'happy',
		'calm',
		'wink',
		'idea',
		'excited'
	],
	stage: OltpOlapStage,
	text: { id, en }
};
