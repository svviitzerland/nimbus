import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/MitmStage.svelte';
import { id } from './id';
import { en } from './en';
export const mitm: Lesson = {
	id: 'mitm',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
