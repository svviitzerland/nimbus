import PortStage from '$lib/components/stages/PortStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const port: Lesson = {
	id: 'port',
	mood: 'thinking',
	moods: ['thinking', 'calm', 'idea', 'happy'],
	reactionMood: {
		'22': 'idea',
		'80': 'happy',
		'443': 'happy',
		'3389': 'idea',
		'5432': 'idea',
		all: 'excited'
	},
	stage: PortStage,
	text: { id, en }
};
