import TestingStage from '$lib/components/stages/TestingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const testing: Lesson = {
	id: 'testing',
	mood: 'thinking',
	playable: true,
	stage: TestingStage,
	text: { id, en }
};
