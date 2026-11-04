import LoadBalancerStage from '$lib/components/stages/LoadBalancerStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const loadBalancer: Lesson = {
	id: 'load-balancer',
	mood: 'thinking',
	moods: ['calm', 'worried', 'idea', 'happy', 'surprised', 'wink', 'thinking'],
	reactionMood: { overload: 'worried', balanced: 'excited', rerouted: 'happy' },
	stage: LoadBalancerStage,
	text: { id, en }
};
