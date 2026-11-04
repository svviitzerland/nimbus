import GitRemoteStage from '$lib/components/stages/GitRemoteStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const gitVsGithub: Lesson = {
	id: 'git-vs-github',
	mood: 'thinking',
	moods: ['thinking', 'worried', 'surprised', 'happy'],
	reactionMood: { committed: 'calm', pushed: 'excited', cloned: 'happy' },
	stage: GitRemoteStage,
	text: { id, en }
};
