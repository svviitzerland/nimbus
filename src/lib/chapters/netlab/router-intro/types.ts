import type { LessonText } from '../../types';

export interface RouterIntroText extends LessonText {
	missionsLabel: string; // heading of the mission checklist
	missions: string[]; // four labels, in order: identity, interfaces, address, address list
	hintBtn: string; // chip that types the mission command for you
	doneNote: string; // shown once every mission is done
	ispLabel: string; // the box the ether1 cable comes from
	laptopLabel: string; // the device on ether2
	portsCaption: string; // caption under the router (physical ports)
	logicalCaption: string; // caption on the beat that contrasts logical ports
	inputLabel: string; // aria label of the command field
	// Muted "#" lines the terminal prints to help after a command
	termHint: string;
	hintUnknown: string;
	didYouMean: string; // template with {word}
	hintName: string;
	hintAddr: string;
	hintIface: string;
	hintNeeds: string;
	hintWrongPort: string;
	hintAddFirst: string;
	hintDynamic: string;
	hintRunning: string;
}
