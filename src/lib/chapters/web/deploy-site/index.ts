import DeploySiteStage from '$lib/components/stages/DeploySiteStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const deploySite: Lesson = {
	id: 'deploy-site',
	mood: 'happy',
	moods: ['thinking', 'idea', 'calm', 'thinking', 'idea', 'wink', 'excited'],
	reactionMood: {
		platform: 'excited',
		vpsWait: 'thinking',
		vps: 'happy',
		both: 'wink'
	},
	stage: DeploySiteStage,
	text: { id, en }
};
