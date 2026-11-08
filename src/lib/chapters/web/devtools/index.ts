import DevtoolsStage from '$lib/components/stages/DevtoolsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const devtools: Lesson = {
	id: 'devtools',
	mood: 'thinking',
	playable: true,
	stage: DevtoolsStage,
	text: { id, en }
};
