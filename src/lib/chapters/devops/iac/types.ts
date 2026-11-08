import type { LessonText } from '../../types';

export interface IacText extends LessonText {
	/** Short names for the two acts, shown as tabs at the top. */
	acts: string[];
	consoleTitle: string; // the cloud console's create form
	sizeLabel: string;
	regionLabel: string;
	sizes: string[]; // e.g. small, medium, large
	regions: string[]; // e.g. jakarta, singapore
	createBtn: string;
	clicksTag: string; // template with {n}
	serverLabel: string; // template with {n}
	sameTag: string; // every server matches
	driftTag: string; // the servers ended up different
	disasterBtn: string;
	applyBtn: string;
	countHint: string; // explains the plus and minus next to count
	nextAct: string;
	noteHand: string; // template with {n}, servers left to build by hand
	noteHandDone: string;
	noteHandLost: string;
	noteCode: string;
	noteCodeLive: string;
	noteCodeLost: string;
	noteRebuilt: string;
}
