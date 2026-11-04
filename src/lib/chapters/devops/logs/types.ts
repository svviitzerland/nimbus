import type { LessonText } from '../../types';

/** The words the optional search on the last beat can look for. */
export type LogQuery = 'error' | 'checkout' | 'slow';

export interface LogsText extends LessonText {
	/** The side panel, one entry per beat (tag, title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	fleetLabel: string; // heading over the twenty servers
	centralLabel: string; // the one place every line flows into
	serverLog: string; // template with {s}, the log of one server
	allLog: string; // the merged log of every server
	loginTag: string; // template with {n}, logins so far while hopping
	goneTag: string; // on a server that was switched off
	searchPlaceholder: string;
	noResults: string;
	foundTag: string; // on web-14 once the bad line is found
	pickLabel: string; // caption over the optional search words
}
