import CiscoSshStage from '$lib/components/stages/CiscoSshStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoSsh: Lesson = {
	id: 'cisco-ssh',
	mood: 'thinking',
	moods: [
		'thinking',
		'worried',
		'idea',
		'calm',
		'thinking',
		'calm',
		'happy',
		'excited',
		'wink',
		'happy'
	],
	reactionMood: {
		task: 'excited',
		reloaded: 'surprised',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		badSecret: 'worried',
		error: 'surprised'
	},
	stage: CiscoSshStage,
	text: { id, en }
};
