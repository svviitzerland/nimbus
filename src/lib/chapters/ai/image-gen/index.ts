import ImageGenStage from '$lib/components/stages/ImageGenStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const imageGen: Lesson = {
	id: 'image-gen',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'idea', 'thinking', 'happy', 'idea', 'wink', 'idea', 'happy'],
	reactionMood: { reprompt: 'excited' },
	stage: ImageGenStage,
	text: { id, en }
};
