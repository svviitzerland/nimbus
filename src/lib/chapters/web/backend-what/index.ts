import BackendWhatStage from '$lib/components/stages/BackendWhatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backendWhat: Lesson = {
	id: 'backend-what',
	mood: 'calm',
	moods: ['calm', 'thinking', 'idea', 'thinking', 'calm', 'happy', 'wink', 'idea', 'excited'],
	reactionMood: { loggedOut: 'surprised', loggedIn: 'happy' },
	stage: BackendWhatStage,
	text: { id, en }
};
