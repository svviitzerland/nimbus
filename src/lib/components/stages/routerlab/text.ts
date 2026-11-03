import type { LessonText } from '$lib/chapters/types';

/** Text every MikroTik Lab stage shares (missions card, terminal helper lines, the ISP box). */
export interface RouterLabText extends LessonText {
	missionsLabel: string; // heading of the mission checklist
	missions: string[]; // mission labels, in the order the stage lists them
	hintBtn: string; // chip that does the mission for you
	doneNote: string; // shown once every mission is done
	ispLabel: string; // the box the ether1 cable comes from
	inputLabel: string; // aria label of the command field
	termHint: string; // muted "#" line seeded in the terminal
	hintUnknown: string; // after a command that does not exist
	didYouMean: string; // template with {word}
}
