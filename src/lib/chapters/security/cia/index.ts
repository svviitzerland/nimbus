import CiaStage from '$lib/components/stages/CiaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const cia: Lesson = {
	id: 'cia',
	mood: 'thinking',
	moods: ['calm', 'idea', 'thinking', 'wink', 'worried', 'excited'],
	reactionMood: {
		yahoo: 'worried',
		laptop: 'thinking',
		ap: 'surprised',
		price: 'wink',
		dyn: 'sad',
		power: 'idea',
		miss: 'thinking'
	},
	playable: true,
	stage: CiaStage,
	text: { id, en }
};
