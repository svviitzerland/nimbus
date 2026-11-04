import RemoteAccessStage from '$lib/components/stages/RemoteAccessStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const remoteAccess: Lesson = {
	id: 'remote-access',
	mood: 'calm',
	moods: ['thinking', 'calm', 'thinking', 'idea', 'wink', 'happy'],
	reactionMood: { ssh: 'idea', rdp: 'happy', both: 'excited' },
	stage: RemoteAccessStage,
	text: { id, en }
};
