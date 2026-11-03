import GitHostsStage from '$lib/components/stages/GitHostsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const gitHosts: Lesson = {
	id: 'git-hosts',
	section: 'Git & GitHub',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'wink'],
	reactionMood: {
		github: 'happy',
		gitlab: 'calm',
		bitbucket: 'calm',
		gitea: 'calm',
		why: 'idea'
	},
	stage: GitHostsStage,
	text: { id, en }
};
