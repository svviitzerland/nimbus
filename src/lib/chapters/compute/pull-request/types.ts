import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface PullRequestText extends LessonText {
	/** Side panel parts, one per beat (ten). */
	steps: GuideStep[];
	/** The pull request itself. */
	prTitle: string;
	openBadge: string;
	mergedBadge: string;
	/** Scene 0, the branch before it is proposed. */
	notMerged: string;
	/** The description skeleton caption under the header. */
	opened: string; // "Citra wants to merge 1 commit"
	/** The homepage title shown as context in the diff (the line that did not change). */
	pageTitle: string;
	/** The button already on the page (context) and the one Citra adds. */
	oldBtn: string;
	newBtn: string;
	/** Adi's review comment on the button line. */
	reviewer: string;
	comment: string;
	/** Citra's follow up commit message. */
	fixCommit: string;
	/** The automatic checks. */
	checksLabel: string;
	checkNames: string[];
	running: string;
	passed: string;
	/** Approve and merge. */
	approved: string;
	mergeBtn: string;
	mergedText: string;
	liveText: string;
	lockNote: string;
	/** The five milestones along the bottom of the card. */
	timeline: string[];
}
