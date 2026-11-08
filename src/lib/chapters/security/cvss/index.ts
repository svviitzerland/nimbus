import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/CvssStage.svelte';
import { id } from './id';
import { en } from './en';
export const cvss: Lesson = {
	id: 'cvss',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
