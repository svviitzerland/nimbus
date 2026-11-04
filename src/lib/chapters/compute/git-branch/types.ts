import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface GitBranchText extends LessonText {
	/** Side panel parts, one per beat (ten). */
	steps: GuideStep[];
	/** The homepage title of nimbus.com, before, in Adi's branch, and in Citra's branch. */
	siteTitles: { start: string; adi: string; citra: string };
	/** The button Adi adds on his branch. */
	signupBtn: string;
	/** Chip on the site card, the site always shows main. */
	liveChip: string;
	/** Short commit labels on the graph. */
	buttonCommit: string;
	titleCommit: string;
	/** Tags on Citra's merge, while it is stuck and once it is solved. */
	conflictTag: string;
	resolvedTag: string;
}
