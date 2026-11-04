import CtfStage from '$lib/components/stages/CtfStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ctf: Lesson = {
	id: 'ctf',
	mood: 'excited',
	moods: ['thinking', 'happy', 'wink', 'idea', 'thinking', 'excited', 'calm', 'idea', 'wink'],
	reactionMood: { solved: 'excited' },
	stage: CtfStage,
	text: { id, en }
};
