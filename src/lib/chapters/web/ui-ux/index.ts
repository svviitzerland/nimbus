import UiUxStage from '$lib/components/stages/UiUxStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const uiUx: Lesson = {
	id: 'ui-ux',
	mood: 'calm',
	moods: ['calm', 'idea', 'happy', 'worried', 'happy', 'wink', 'idea', 'excited'],
	reactionMood: { messy: 'worried', clear: 'happy' },
	stage: UiUxStage,
	text: { id, en }
};
