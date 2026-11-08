import FormsStage from '$lib/components/stages/FormsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const forms: Lesson = {
	id: 'forms',
	mood: 'thinking',
	playable: true,
	stage: FormsStage,
	text: { id, en }
};
