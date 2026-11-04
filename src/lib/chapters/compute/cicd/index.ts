import CicdStage from '$lib/components/stages/CicdStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cicd: Lesson = {
	id: 'cicd',
	mood: 'thinking',
	moods: ['worried', 'calm', 'idea', 'thinking', 'happy'],
	reactionMood: { pass: 'happy', caught: 'idea', both: 'excited' },
	stage: CicdStage,
	text: { id, en }
};
