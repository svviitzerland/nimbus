import DataLeakageStage from '$lib/components/stages/DataLeakageStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dataLeakage: Lesson = {
	id: 'data-leakage',
	mood: 'thinking',
	playable: true,
	stage: DataLeakageStage,
	text: { id, en }
};
