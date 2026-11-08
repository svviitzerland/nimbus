import QosStage from '$lib/components/stages/QosStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const qos: Lesson = {
	id: 'qos',
	mood: 'thinking',
	moods: ['worried', 'thinking', 'idea', 'thinking', 'wink', 'happy'],
	reactionMood: {
		stutter: 'worried',
		qosOn: 'thinking',
		allSame: 'wink',
		dlFirst: 'surprised',
		callFixed: 'happy',
		fixed: 'excited',
		qosOff: 'sad'
	},
	playable: true,
	stage: QosStage,
	text: { id, en }
};
