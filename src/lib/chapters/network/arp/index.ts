import ArpStage from '$lib/components/stages/ArpStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const arp: Lesson = {
	id: 'arp',
	mood: 'thinking',
	playable: true,
	stage: ArpStage,
	text: { id, en }
};
