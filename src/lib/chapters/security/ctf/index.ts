import CtfStage from '$lib/components/stages/CtfStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ctf: Lesson = {
	id: 'ctf',
	mood: 'excited',
	moods: ['thinking', 'happy', 'idea', 'wink', 'surprised', 'excited'],
	reactionMood: {
		decoded: 'idea',
		caesar: 'happy',
		peek: 'wink',
		source: 'excited',
		tryFail: 'thinking',
		cracked: 'surprised',
		password: 'happy',
		wrongFlag: 'thinking',
		allFlags: 'excited'
	},
	playable: true,
	stage: CtfStage,
	text: { id, en }
};
