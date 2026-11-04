import WifiStage from '$lib/components/stages/WifiStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wifi: Lesson = {
	id: 'wifi',
	mood: 'happy',
	moods: ['happy', 'calm', 'worried', 'wink', 'thinking', 'idea', 'excited'],
	reactionMood: { near: 'excited', mid: 'thinking', far: 'worried' },
	stage: WifiStage,
	text: { id, en }
};
