import GitBranchStage from '$lib/components/stages/GitBranchStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const gitBranch: Lesson = {
	id: 'git-branch',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'thinking',
		'happy',
		'thinking',
		'surprised',
		'calm',
		'happy',
		'wink',
		'excited'
	],
	stage: GitBranchStage,
	text: { id, en }
};
