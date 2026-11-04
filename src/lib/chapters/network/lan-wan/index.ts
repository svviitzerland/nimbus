import LanWanStage from '$lib/components/stages/LanWanStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const lanWan: Lesson = {
	id: 'lan-wan',
	mood: 'happy',
	moods: ['happy', 'calm', 'thinking', 'excited', 'wink', 'idea', 'excited'],
	reactionMood: { lan: 'happy', wan: 'idea', internet: 'excited' },
	stage: LanWanStage,
	text: { id, en }
};
