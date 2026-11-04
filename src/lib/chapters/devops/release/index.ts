import ReleaseStage from '$lib/components/stages/ReleaseStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const release: Lesson = {
	id: 'release',
	mood: 'calm',
	moods: ['calm', 'worried', 'idea', 'thinking', 'happy', 'excited', 'wink', 'calm', 'happy'],
	reactionMood: { bigbang: 'sad', canary: 'happy' },
	stage: ReleaseStage,
	text: { id, en }
};
