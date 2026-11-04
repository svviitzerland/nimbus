import LabPickStage from '$lib/components/stages/LabPickStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

/** The door into the network lab, where the learner picks the gear they practise on. */
export const labPick: Lesson = {
	id: 'lab-pick',
	mood: 'excited',
	moods: ['happy', 'idea', 'wink', 'idea', 'excited'],
	reactionMood: { mikrotik: 'happy', cisco: 'excited' },
	stage: LabPickStage,
	text: { id, en }
};
