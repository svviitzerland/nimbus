import AZStage from '$lib/components/stages/AZStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const availabilityZone: Lesson = {
	id: 'availability-zone',
	mood: 'thinking',
	moods: ['surprised', 'worried', 'thinking', 'worried', 'thinking', 'wink', 'idea', 'happy'],
	reactionMood: {
		virginia: 'happy',
		'virginia-name': 'wink',
		singapore: 'happy',
		'singapore-name': 'wink',
		down: 'sad',
		survived: 'excited'
	},
	stage: AZStage,
	text: { id, en }
};
