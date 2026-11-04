import type { LessonText } from '$lib/chapters/types';
import type { ShellText } from './shell.svelte';

/** One step of the guided side panel, one per Nim beat. */
export type LabStep = { title: string; body: string; tag?: string };

/** Text every Cisco Lab stage shares (the guided panel, the terminal, its helper lines). */
export interface CiscoLabText extends LessonText, ShellText {
	steps: LabStep[]; // one per intro beat, the last one describes the learner's task
	inputLabel: string; // aria label of the command field
	ispLabel: string; // the box the GigabitEthernet0/0 cable comes from
	doneNote: string; // shown in the panel once the learner's task is done
}
