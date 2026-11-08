import TlsStage from '$lib/components/stages/TlsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const tls: Lesson = {
	id: 'tls',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'wink', 'idea', 'thinking', 'happy', 'excited'],
	reactionMood: {
		hello: 'happy',
		cert: 'thinking',
		check: 'idea',
		key: 'surprised',
		secure: 'excited',
		warn: 'worried',
		back: 'happy',
		proceed: 'sad'
	},
	playable: true,
	stage: TlsStage,
	text: { id, en }
};
