import IdsStage from '$lib/components/stages/IdsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ids: Lesson = {
	id: 'ids',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'wink', 'thinking', 'calm', 'idea', 'excited'],
	reactionMood: { ids: 'thinking', ips: 'happy' },
	stage: IdsStage,
	text: { id, en }
};
