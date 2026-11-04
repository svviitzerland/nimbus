import type { LessonText } from '../../types';

export interface OnCallText extends LessonText {
	/** The side panel, one entry per beat (tag, title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	// the phone on the nightstand
	onCallNote: string; // you are on call this week
	pagerApp: string; // the app name on the notification
	alertTitle: string; // short, fits a phone screen
	alertBody: string;
	ackBtn: string;
	ackedTag: string;
	resolvedTag: string;
	// the runbook on the clipboard
	runbookTitle: string;
	runbook: { label: string; result: string }[]; // four steps
	// the post mortem that replaces it
	pmTitle: string;
	blameLine: string; // the tempting answer, crossed out
	pmLines: string[]; // three blameless lines
	// the error chart
	errorsLabel: string;
	releaseTag: string;
	/** Optional on the last beat, the tempting move that is not in the runbook. */
	panicBtn: string;
}
