import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/SsrfStage.svelte';
import { id } from './id';
import { en } from './en';
export const ssrf: Lesson = {
	id: 'ssrf',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
