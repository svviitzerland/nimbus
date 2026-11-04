import VpnStage from '$lib/components/stages/VpnStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vpn: Lesson = {
	id: 'vpn',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'worried', 'idea', 'happy', 'excited', 'wink', 'thinking', 'happy'],
	reactionMood: { off: 'worried', on: 'happy' },
	stage: VpnStage,
	text: { id, en }
};
