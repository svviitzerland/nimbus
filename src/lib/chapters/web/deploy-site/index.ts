import DeploySiteStage from '$lib/components/stages/DeploySiteStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const deploySite: Lesson = {
	id: 'deploy-site',
	mood: 'calm',
	moods: ['worried', 'idea', 'happy', 'thinking', 'excited', 'wink', 'calm', 'idea', 'happy'],
	reactionMood: { push: 'excited' },
	stage: DeploySiteStage,
	text: { id, en }
};
