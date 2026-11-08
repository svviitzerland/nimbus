import DataCenterStage from '$lib/components/stages/DataCenterStage.svelte';
import type { Lesson } from '../../types';
import { id } from './id';
import { en } from './en';

export const dataCenter: Lesson = {
	id: 'data-center',
	mood: 'thinking',
	playable: true,
	stage: DataCenterStage,
	text: { id, en }
};
