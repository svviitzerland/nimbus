import JsStage from '$lib/components/stages/JsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const js: Lesson = {
	id: 'js',
	mood: 'calm',
	moods: ['thinking', 'idea', 'calm', 'calm', 'wink', 'worried', 'excited'],
	reactionMood: {
		count: 'happy',
		step: 'excited',
		broken: 'surprised',
		dead: 'sad',
		fixed: 'happy',
		loop: 'wink',
		done: 'excited'
	},
	stage: JsStage,
	text: { id, en }
};
