import VersionControlStage from '$lib/components/stages/VersionControlStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const versionControl: Lesson = {
	id: 'version-control',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'calm', 'happy'],
	reactionMood: { firstCommit: 'happy', grew: 'happy', checkout: 'excited', latest: 'calm' },
	stage: VersionControlStage,
	text: { id, en }
};
