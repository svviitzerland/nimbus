import ComponentsStage from '$lib/components/stages/ComponentsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const components: Lesson = {
	id: 'components',
	mood: 'calm',
	moods: ['calm', 'idea', 'happy', 'thinking', 'excited', 'wink', 'idea', 'happy'],
	reactionMood: { plain: 'surprised', upgrade: 'excited' },
	stage: ComponentsStage,
	text: { id, en }
};
