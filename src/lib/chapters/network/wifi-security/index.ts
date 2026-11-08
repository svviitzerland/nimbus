import WifiSecurityStage from '$lib/components/stages/WifiSecurityStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wifiSecurity: Lesson = {
	id: 'wifi-security',
	mood: 'thinking',
	moods: ['surprised', 'thinking', 'worried', 'thinking', 'idea', 'happy', 'wink', 'happy'],
	reactionMood: {
		open: 'worried',
		wpa2weak: 'surprised',
		wpa2: 'happy',
		wpa3: 'excited',
		guest: 'happy'
	},
	playable: true,
	stage: WifiSecurityStage,
	text: { id, en }
};
