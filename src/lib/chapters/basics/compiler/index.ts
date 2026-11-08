import CompilerStage from '$lib/components/stages/CompilerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const compiler: Lesson = {
	id: 'compiler',
	mood: 'thinking',
	moods: ['thinking', 'idea', 'calm', 'calm', 'surprised', 'wink', 'excited'],
	reactionMood: { race: 'excited', rerun: 'happy', typo: 'surprised' },
	playable: true,
	stage: CompilerStage,
	text: { id, en }
};
