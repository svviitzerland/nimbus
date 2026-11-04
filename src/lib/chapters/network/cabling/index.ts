import CablingStage from '$lib/components/stages/CablingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cabling: Lesson = {
	id: 'cabling',
	mood: 'calm',
	moods: ['calm', 'happy', 'worried', 'excited', 'wink', 'idea', 'excited'],
	reactionMood: {
		copperOk: 'happy',
		copperFail: 'sad',
		fibreFar: 'excited'
	},
	stage: CablingStage,
	text: { id, en }
};
