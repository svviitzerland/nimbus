import type { LessonText } from '../../types';

export interface OnCallText extends LessonText {
	/** Short names for the three acts, shown as tabs at the top. */
	acts: string[];
	// Act 1, the page in the night
	pagerApp: string; // the app name on the notification
	alertTitle: string;
	alertBody: string;
	onCallNote: string; // you are on call this week
	escalateNote: string; // who gets called next if nobody answers
	ackBtn: string;
	ackedTag: string;
	runbookBtn: string; // moves on to the runbook
	// Act 2, the runbook
	runbookTitle: string;
	errorsLabel: string; // caption under the live error rate
	panicBtn: string; // the tempting move that is not in the runbook
	panicResult: string;
	steps: { label: string; result: string }[];
	rollingTag: string; // shown while the rollback runs
	postBtn: string; // moves on to the post mortem
	// Act 3, the blameless post mortem
	pmTitle: string;
	timelineLabel: string;
	timeline: string[];
	questions: { q: string; good: string; bad: string }[];
	nopeTag: string; // flashed on a blaming answer
	pmDoneTag: string;
	noteAlarm: string;
	noteAcked: string;
	noteRunbook: string;
	noteFixed: string;
	notePm: string;
	notePmDone: string;
}
