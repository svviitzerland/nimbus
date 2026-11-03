import SniffingStage from '$lib/components/stages/SniffingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const sniffing: Lesson = {
	id: 'sniffing',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'surprised', 'wink', 'excited'],
	reactionMood: {
		http: 'sad',
		https: 'happy',
		real: 'wink',
		twin: 'worried',
		mitmHttp: 'surprised',
		mitmHttps: 'excited'
	},
	stage: SniffingStage,
	text: { id, en }
};
