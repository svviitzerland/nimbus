import type { LessonText } from '$lib/chapters/types';
import type { ShellText } from './shell.svelte';

/** One panel of the guided side card, may hold simple HTML like <b>. */
export interface GuidePanel {
	tag?: string;
	title: string;
	body: string;
}

/** Text every guided Linux lesson shares (side panels, terminal labels, helper lines). */
export interface LinuxGuideText extends LessonText, ShellText {
	/** One panel per beat of the guided part, the last one is the learner's turn. */
	panels: GuidePanel[];
	watchLabel: string; // over the terminal while Nim types the commands
	tryLabel: string; // over the terminal on the learner's turn, followed by the command
	tryTip: string; // title of the command chip, which types it if tapped
	inputLabel: string; // aria label of the command field
}
