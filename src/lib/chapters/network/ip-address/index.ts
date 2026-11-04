import IpAddressStage from '$lib/components/stages/IpAddressStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ipAddress: Lesson = {
	id: 'ip-address',
	mood: 'calm',
	moods: ['calm', 'idea', 'happy', 'thinking', 'wink', 'happy', 'idea', 'excited'],
	reactionMood: { lost: 'thinking', public: 'excited' },
	stage: IpAddressStage,
	text: { id, en }
};
