import CssStage from '$lib/components/stages/CssStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const css: Lesson = {
	id: 'css',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy', 'idea', 'excited', 'wink', 'idea', 'excited'],
	reactionMood: { color: 'happy' },
	stage: CssStage,
	text: { id, en }
};
