import ProtocolsStage from '$lib/components/stages/ProtocolsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const protocols: Lesson = {
	id: 'protocols',
	mood: 'thinking',
	moods: ['calm', 'idea', 'happy', 'happy', 'thinking', 'idea', 'wink', 'idea', 'happy'],
	reactionMood: {
		http: 'thinking',
		https: 'happy',
		ssh: 'wink',
		dns: 'idea'
	},
	stage: ProtocolsStage,
	text: { id, en }
};
