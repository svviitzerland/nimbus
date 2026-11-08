import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/CsrfStage.svelte';
import { id } from './id';
import { en } from './en';
export const csrf: Lesson = {
	id: 'csrf',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
