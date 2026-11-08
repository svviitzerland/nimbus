import CablingStage from '$lib/components/stages/CablingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cabling: Lesson = {
	id: 'cabling',
	mood: 'thinking',
	moods: ['calm', 'happy', 'worried', 'excited', 'wink', 'idea'],
	reactionMood: {
		copperOk: 'happy',
		copperFail: 'sad',
		fibreOk: 'thinking',
		fibreFar: 'excited'
	},
	playable: true,
	stage: CablingStage,
	text: { id, en }
};
