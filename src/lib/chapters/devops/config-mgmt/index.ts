import ConfigMgmtStage from '$lib/components/stages/ConfigMgmtStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const configMgmt: Lesson = {
	id: 'config-mgmt',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: { manual: 'thinking', typo: 'surprised', playbook: 'excited', again: 'happy' },
	stage: ConfigMgmtStage,
	text: { id, en }
};
