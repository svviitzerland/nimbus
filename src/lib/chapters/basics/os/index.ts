import OsStage from '$lib/components/stages/OsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const os: Lesson = {
	id: 'os',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'happy', 'thinking', 'calm', 'wink', 'excited'],
	reactionMood: { first: 'happy', more: 'excited', slow: 'worried', close: 'happy' },
	stage: OsStage,
	text: { id, en }
};
