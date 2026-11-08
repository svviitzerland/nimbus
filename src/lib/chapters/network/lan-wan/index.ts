import LanWanStage from '$lib/components/stages/LanWanStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const lanWan: Lesson = {
	id: 'lan-wan',
	mood: 'happy',
	moods: ['happy', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: { lan: 'happy', wan: 'idea', internet: 'excited' },
	playable: true,
	stage: LanWanStage,
	text: { id, en }
};
