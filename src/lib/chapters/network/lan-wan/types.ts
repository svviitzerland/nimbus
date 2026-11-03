import type { LessonText } from '../../types';

export interface LanWanLevelText {
	tab: string; // short name in the step row, e.g. "LAN"
	scope: string; // how big it is, e.g. "one room"
	hint: string; // what to tap at this level
	done: string; // caption once the level is fully wired
}

export interface LanWanText extends LessonText {
	levels: { lan: LanWanLevelText; wan: LanWanLevelText; net: LanWanLevelText };
	zoomBtn: string; // moves out to the next, bigger level
	againBtn: string; // starts over from the room
	switchLabel: string; // the box in the middle of the room
	laptopLabel: string;
	pcLabel: string;
	hqLabel: string; // the head office, which holds the room you just wired
	branchLabel: string; // template with {n}
	/** The networks of the world level, in order. The first one is your own company. */
	nets: string[];
}
