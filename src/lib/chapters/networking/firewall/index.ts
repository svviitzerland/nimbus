import FirewallStage from '$lib/components/stages/FirewallStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const firewall: Lesson = {
	id: 'firewall',
	mood: 'thinking',
	moods: ['worried', 'idea', 'thinking', 'idea', 'happy'],
	reactionMood: { allow: 'happy', deny: 'excited' },
	stage: FirewallStage,
	text: { id, en }
};
