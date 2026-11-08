import type { Lesson } from '../../types';
import Stage from '$lib/components/stages/RiskStage.svelte';
import { id } from './id';
import { en } from './en';
export const risk: Lesson = {
	id: 'risk',
	mood: 'thinking',
	playable: true,
	stage: Stage,
	text: { id, en }
};
