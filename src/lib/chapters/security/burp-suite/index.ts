import BurpSuiteStage from '$lib/components/stages/BurpSuiteStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const burpSuite: Lesson = {
	id: 'burp-suite',
	mood: 'thinking',
	playable: true,
	stage: BurpSuiteStage,
	text: { id, en }
};
