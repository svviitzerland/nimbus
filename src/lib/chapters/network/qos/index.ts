import QosStage from '$lib/components/stages/QosStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const qos: Lesson = {
	id: 'qos',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'happy', 'wink', 'idea', 'happy'],
	reactionMood: {
		qosOff: 'worried',
		qosOn: 'happy'
	},
	stage: QosStage,
	text: { id, en }
};
