import CiscoAclStage from '$lib/components/stages/CiscoAclStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoAcl: Lesson = {
	id: 'cisco-acl',
	mood: 'thinking',
	moods: [
		'thinking',
		'idea',
		'wink',
		'calm',
		'surprised',
		'happy',
		'happy',
		'idea',
		'wink',
		'happy'
	],
	reactionMood: {
		task: 'excited',
		tooOpen: 'worried',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		needSub: 'thinking',
		error: 'surprised'
	},
	stage: CiscoAclStage,
	text: { id, en }
};
