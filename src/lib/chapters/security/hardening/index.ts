import HardeningStage from '$lib/components/stages/HardeningStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hardening: Lesson = {
	id: 'hardening',
	mood: 'thinking',
	moods: ['surprised', 'worried', 'idea', 'sad', 'wink', 'excited'],
	reactionMood: {
		scan: 'worried',
		update: 'happy',
		telnet: 'idea',
		db: 'happy',
		sshkey: 'wink',
		root: 'idea',
		default: 'surprised',
		web: 'sad',
		done: 'excited'
	},
	stage: HardeningStage,
	text: { id, en }
};
