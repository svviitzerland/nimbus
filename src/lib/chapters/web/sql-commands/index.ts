import SqlCommandsStage from '$lib/components/stages/SqlCommandsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sqlCommands: Lesson = {
	id: 'sql-commands',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'happy', 'wink', 'thinking', 'idea', 'excited', 'surprised'],
	stage: SqlCommandsStage,
	text: { id, en }
};
