import SecretsStage from '$lib/components/stages/SecretsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const secrets: Lesson = {
	id: 'secrets',
	mood: 'thinking',
	playable: true,
	stage: SecretsStage,
	text: { id, en }
};
