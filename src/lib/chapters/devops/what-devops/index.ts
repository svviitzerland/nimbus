import WhatDevopsStage from '$lib/components/stages/WhatDevopsStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const whatDevops: Lesson = {
	id: 'what-devops',
	mood: 'calm',
	moods: ['calm', 'thinking', 'worried', 'idea', 'happy', 'thinking', 'wink', 'calm', 'excited'],
	reactionMood: { old: 'worried', new: 'happy' },
	stage: WhatDevopsStage,
	text: { id, en }
};
