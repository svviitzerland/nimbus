import DomainHostingStage from '$lib/components/stages/DomainHostingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const domainHosting: Lesson = {
	id: 'domain-hosting',
	mood: 'calm',
	moods: ['calm', 'idea', 'thinking', 'calm', 'idea', 'wink', 'excited'],
	reactionMood: {
		taken: 'sad',
		bought: 'happy',
		shared: 'calm',
		vps: 'happy',
		cloud: 'happy',
		unreachable: 'worried',
		wrongip: 'thinking',
		connected: 'idea',
		live: 'excited'
	},
	stage: DomainHostingStage,
	text: { id, en }
};
