import TlsStage from '$lib/components/stages/TlsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const tls: Lesson = {
	id: 'tls',
	mood: 'thinking',
	moods: [
		'calm',
		'thinking',
		'wink',
		'happy',
		'idea',
		'thinking',
		'surprised',
		'excited',
		'wink',
		'worried',
		'happy'
	],
	reactionMood: {
		home: 'happy',
		cafe: 'worried'
	},
	stage: TlsStage,
	text: { id, en }
};
