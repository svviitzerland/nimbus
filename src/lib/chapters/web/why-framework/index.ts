import WhyFrameworkStage from '$lib/components/stages/WhyFrameworkStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whyFramework: Lesson = {
	id: 'why-framework',
	mood: 'calm',
	moods: ['calm', 'thinking', 'worried', 'idea', 'calm', 'wink', 'happy', 'excited'],
	reactionMood: { price: 'excited' },
	stage: WhyFrameworkStage,
	text: { id, en }
};
