import ConfigMgmtStage from '$lib/components/stages/ConfigMgmtStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const configMgmt: Lesson = {
	id: 'config-mgmt',
	mood: 'calm',
	moods: ['calm', 'thinking', 'worried', 'idea', 'excited', 'happy', 'wink', 'calm', 'happy'],
	reactionMood: { drift: 'happy' },
	stage: ConfigMgmtStage,
	text: { id, en }
};
