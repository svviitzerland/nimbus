import WhatDevopsStage from '$lib/components/stages/WhatDevopsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whatDevops: Lesson = {
	id: 'what-devops',
	mood: 'thinking',
	moods: ['calm', 'worried', 'sad', 'idea', 'wink', 'happy'],
	reactionMood: { yearly: 'worried', middle: 'thinking', daily: 'happy', both: 'excited' },
	playable: true,
	stage: WhatDevopsStage,
	text: { id, en }
};
