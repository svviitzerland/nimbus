import AccessControlStage from '$lib/components/stages/AccessControlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const accessControl: Lesson = {
	id: 'access-control',
	mood: 'thinking',
	playable: true,
	stage: AccessControlStage,
	text: { id, en }
};
