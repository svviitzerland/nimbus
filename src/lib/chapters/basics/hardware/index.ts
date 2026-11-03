import HardwareStage from '$lib/components/stages/HardwareStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const hardware: Lesson = {
	id: 'hardware',
	mood: 'happy',
	moods: ['happy', 'idea', 'thinking', 'calm', 'idea', 'wink', 'excited'],
	reactionMood: { load: 'happy', run: 'excited', unplug: 'surprised', power: 'calm' },
	stage: HardwareStage,
	text: { id, en }
};
