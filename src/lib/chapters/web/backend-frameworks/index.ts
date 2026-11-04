import BackendFrameworksStage from '$lib/components/stages/BackendFrameworksStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const backendFrameworks: Lesson = {
	id: 'backend-frameworks',
	mood: 'calm',
	moods: ['calm', 'thinking', 'worried', 'idea', 'happy', 'wink', 'calm', 'excited'],
	reactionMood: { byhand: 'surprised', framework: 'happy' },
	stage: BackendFrameworksStage,
	text: { id, en }
};
