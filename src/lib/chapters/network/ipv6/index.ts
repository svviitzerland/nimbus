import Ipv6Stage from '$lib/components/stages/Ipv6Stage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const ipv6: Lesson = {
	id: 'ipv6',
	mood: 'thinking',
	moods: ['calm', 'thinking', 'surprised', 'sad', 'idea', 'excited', 'wink', 'wink', 'happy'],
	reactionMood: {
		sand: 'surprised'
	},
	stage: Ipv6Stage,
	text: { id, en }
};
