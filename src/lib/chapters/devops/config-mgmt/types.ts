import type { LessonText } from '../../types';

export interface ConfigMgmtText extends LessonText {
	missionLabel: string; // heading over the goal
	mission: string; // what every server needs
	manualBtn: string; // log into the next server by hand
	manualDone: string; // shown on the button when no server is left
	minutesTag: string; // template with {n}, time spent by hand
	typoTag: string; // the server that got a typo
	oldTag: string; // the server still runs the old version
	newTag: string; // the server runs the new version
	hintLabel: string; // caption before the tappable command
	placeholder: string; // input placeholder
	unknown: string; // template with {cmd}, shown for an unknown command
	noteIdle: string;
	noteManual: string; // template with {n}, servers left by hand
	noteTypo: string;
	notePlaybook: string;
	noteAgain: string;
}
