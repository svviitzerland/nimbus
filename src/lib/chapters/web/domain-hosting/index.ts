import DomainHostingStage from '$lib/components/stages/DomainHostingStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const domainHosting: Lesson = {
	id: 'domain-hosting',
	mood: 'calm',
	moods: [
		'calm',
		'idea',
		'happy',
		'thinking',
		'worried',
		'idea',
		'excited',
		'wink',
		'calm',
		'excited'
	],
	reactionMood: {
		wrongip: 'worried',
		fixed: 'happy'
	},
	stage: DomainHostingStage,
	text: { id, en }
};
