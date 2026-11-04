import DesignToCodeStage from '$lib/components/stages/DesignToCodeStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const designToCode: Lesson = {
	id: 'design-to-code',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy', 'excited', 'wink', 'idea', 'happy'],
	reactionMood: { nopad: 'surprised', pad: 'happy' },
	stage: DesignToCodeStage,
	text: { id, en }
};
