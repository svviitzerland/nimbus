import CiscoVlanStage from '$lib/components/stages/CiscoVlanStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ciscoVlan: Lesson = {
	id: 'cisco-vlan',
	mood: 'thinking',
	moods: ['worried', 'idea', 'calm', 'happy', 'happy', 'wink', 'calm', 'excited', 'wink', 'happy'],
	reactionMood: {
		task: 'excited',
		wrongVlan: 'thinking',
		needEnable: 'thinking',
		needConfig: 'thinking',
		needDo: 'wink',
		needSub: 'thinking',
		error: 'surprised'
	},
	stage: CiscoVlanStage,
	text: { id, en }
};
