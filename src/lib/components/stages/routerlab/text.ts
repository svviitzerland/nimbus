import type { LessonText } from '$lib/chapters/types';

/** One part of the picture, explained in the side panel (one per Nim beat). */
export type LabStep = { title: string; body: string; tag?: string };

/** Text every MikroTik Lab stage shares (side panel, terminal helper lines, the ISP box). */
export interface RouterLabText extends LessonText {
	/** Side panel, one entry per beat of `intro`. */
	steps: LabStep[];
	ispLabel: string; // the box the ether1 cable comes from
	inputLabel: string; // aria label of the command field
	tryLabel: string; // small label above the suggested command on the last beat
	termHint: string; // muted "#" line printed when the learner's turn starts
	hintTry: string; // muted "#" line after a command the lab does not know, with {cmd}
	didYouMean: string; // muted "#" line, template with {word}
}
