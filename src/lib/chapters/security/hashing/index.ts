import HashingStage from '$lib/components/stages/HashingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hashing: Lesson = {
	id: 'hashing',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'happy', 'thinking', 'excited', 'wink', 'excited'],
	reactionMood: {
		typed: 'surprised',
		registered: 'happy',
		leaked: 'worried',
		leakedWeak: 'surprised',
		lookup: 'sad',
		salted: 'excited'
	},
	playable: true,
	stage: HashingStage,
	text: { id, en }
};
