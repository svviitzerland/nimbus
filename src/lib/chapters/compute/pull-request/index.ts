import PullRequestStage from '$lib/components/stages/PullRequestStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const pullRequest: Lesson = {
	id: 'pull-request',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'thinking',
		'thinking',
		'happy',
		'calm',
		'happy',
		'excited',
		'wink',
		'idea'
	],
	stage: PullRequestStage,
	text: { id, en }
};
