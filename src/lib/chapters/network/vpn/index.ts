import VpnStage from '$lib/components/stages/VpnStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const vpn: Lesson = {
	id: 'vpn',
	mood: 'thinking',
	moods: ['calm', 'worried', 'worried', 'idea', 'happy', 'wink', 'happy'],
	reactionMood: { blocked: 'worried', on: 'idea', through: 'excited', off: 'thinking' },
	stage: VpnStage,
	text: { id, en }
};
