import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/OwaspStage.svelte';
import { id } from './id';
import { en } from './en';
export const owasp: Lesson = {
	id: 'owasp',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
