import IacStage from '$lib/components/stages/IacStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const iac: Lesson = {
	id: 'iac',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'happy', 'thinking', 'surprised', 'wink', 'calm', 'excited'],
	reactionMood: { more: 'happy', less: 'thinking' },
	stage: IacStage,
	text: { id, en }
};
