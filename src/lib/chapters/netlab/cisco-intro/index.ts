import CiscoIntroStage from '$lib/components/stages/CiscoIntroStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoIntro: Lesson = {
	id: 'cisco-intro',
	mood: 'thinking',
	moods: [
		'calm',
		'idea',
		'thinking',
		'thinking',
		'happy',
		'excited',
		'wink',
		'idea',
		'wink',
		'happy'
	],
	reactionMood: {
		task: 'excited',
		reloaded: 'surprised',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		error: 'surprised'
	},
	stage: CiscoIntroStage,
	text: { id, en }
};
