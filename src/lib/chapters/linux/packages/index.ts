import PackagesStage from '$lib/components/stages/PackagesStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const packages: Lesson = {
	id: 'packages',
	mood: 'happy',
	moods: ['thinking', 'idea', 'happy', 'wink', 'excited'],
	reactionMood: {
		updated: 'happy',
		installed: 'excited',
		version: 'happy',
		opened: 'excited',
		needSudo: 'wink',
		notInstalled: 'idea',
		noPackage: 'thinking',
		already: 'wink',
		other: 'happy',
		abort: 'surprised',
		removed: 'sad',
		removedOther: 'calm',
		upgrade: 'happy',
		offline: 'worried',
		missing: 'thinking',
		denied: 'thinking',
		error: 'surprised',
		done: 'excited'
	},
	stage: PackagesStage,
	text: { id, en }
};
