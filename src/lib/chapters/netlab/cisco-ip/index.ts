import CiscoIpStage from '$lib/components/stages/CiscoIpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoIp: Lesson = {
	id: 'cisco-ip',
	mood: 'thinking',
	moods: [
		'thinking',
		'calm',
		'happy',
		'wink',
		'worried',
		'idea',
		'excited',
		'wink',
		'happy',
		'happy'
	],
	reactionMood: {
		task: 'excited',
		pingOther: 'happy',
		pingMiss: 'thinking',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		needSub: 'thinking',
		mask: 'thinking',
		error: 'surprised'
	},
	stage: CiscoIpStage,
	text: { id, en }
};
