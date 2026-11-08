import ImageGenStage from '$lib/components/stages/ImageGenStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const imageGen: Lesson = {
	id: 'image-gen',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'idea', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: {
		prompt: 'happy',
		step: 'thinking',
		shapes: 'surprised',
		details: 'happy',
		clean: 'excited',
		seed: 'idea',
		reprompt: 'wink'
	},
	playable: true,
	stage: ImageGenStage,
	text: { id, en }
};
