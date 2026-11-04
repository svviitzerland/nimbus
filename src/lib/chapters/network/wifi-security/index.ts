import WifiSecurityStage from '$lib/components/stages/WifiSecurityStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const wifiSecurity: Lesson = {
	id: 'wifi-security',
	mood: 'thinking',
	moods: [
		'surprised',
		'thinking',
		'worried',
		'thinking',
		'idea',
		'happy',
		'wink',
		'thinking',
		'happy'
	],
	reactionMood: { open: 'worried', wpa2: 'thinking', wpa3: 'excited' },
	stage: WifiSecurityStage,
	text: { id, en }
};
