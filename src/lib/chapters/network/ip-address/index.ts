import IpAddressStage from '$lib/components/stages/IpAddressStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ipAddress: Lesson = {
	id: 'ip-address',
	mood: 'calm',
	moods: ['calm', 'happy', 'wink', 'idea', 'idea', 'excited'],
	reactionMood: {
		phone: 'happy',
		laptop: 'happy',
		router: 'idea',
		lost: 'thinking',
		public: 'surprised'
	},
	playable: true,
	stage: IpAddressStage,
	text: { id, en }
};
