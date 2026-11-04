import ConfigSecretsStage from '$lib/components/stages/ConfigSecretsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const configSecrets: Lesson = {
	id: 'config-secrets',
	mood: 'calm',
	moods: ['calm', 'thinking', 'worried', 'idea', 'happy', 'wink', 'calm', 'idea', 'surprised'],
	stage: ConfigSecretsStage,
	text: { id, en }
};
