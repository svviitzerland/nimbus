import WhyFrameworkStage from '$lib/components/stages/WhyFrameworkStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whyFramework: Lesson = {
	id: 'why-framework',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'thinking', 'wink', 'excited'],
	reactionMood: {
		missed: 'worried',
		handDone: 'thinking',
		framework: 'excited'
	},
	playable: true,
	stage: WhyFrameworkStage,
	text: { id, en }
};
