import type { LessonText } from '$lib/chapters/types';
import type { ShellText } from './shell.svelte';

/** Text every Linux lesson shares (missions card, terminal helper lines). */
export interface LinuxLabText extends LessonText, ShellText {
	missionsLabel: string; // heading of the mission checklist
	missions: string[]; // mission labels, in the order the stage lists them
	hintBtn: string; // chip that types the mission command for you
	doneNote: string; // shown once every mission is done
	inputLabel: string; // aria label of the command field
}

export type Mission = { label: string; done: boolean; help?: () => void };
