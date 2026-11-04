import type { LessonText } from '../../types';

export interface ConfigMgmtText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	terminalTab: string; // window title while typing by hand
	serversLabel: string; // caption over the column of servers
	brokenTag: string; // badge on the server that got a typo
	driftTag: string; // badge on a server someone changed by hand
	tapHint: string; // caption over the servers on the last beat
}
