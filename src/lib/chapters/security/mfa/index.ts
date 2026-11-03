import MfaStage from '$lib/components/stages/MfaStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const mfa: Lesson = {
	id: 'mfa',
	mood: 'thinking',
	moods: ['worried', 'idea', 'happy', 'thinking', 'excited', 'wink', 'calm'],
	reactionMood: {
		noMfa: 'sad',
		stuck: 'excited',
		wrongCode: 'thinking',
		you: 'happy'
	},
	stage: MfaStage,
	text: { id, en }
};
