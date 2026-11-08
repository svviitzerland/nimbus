import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/NistStage.svelte';
import { id } from './id';
import { en } from './en';
export const nist: Lesson = {
	id: 'nist',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
