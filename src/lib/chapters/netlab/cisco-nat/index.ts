import CiscoNatStage from '$lib/components/stages/CiscoNatStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoNat: Lesson = {
	id: 'cisco-nat',
	mood: 'thinking',
	moods: [
		'worried',
		'idea',
		'calm',
		'thinking',
		'wink',
		'happy',
		'excited',
		'idea',
		'wink',
		'happy'
	],
	reactionMood: {
		task: 'excited',
		cleared: 'surprised',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		needSub: 'thinking',
		wild: 'thinking',
		error: 'surprised'
	},
	stage: CiscoNatStage,
	text: { id, en }
};
