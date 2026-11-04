import type { LessonText } from '../../types';

/** How often the optional replay backs up. */
export type BackupPlan = 'daily' | 'hourly';

export interface BackupText extends LessonText {
	/** The side panel, one entry per beat (tag, title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	siteLabel: string; // the Jakarta data center
	dbLabel: string; // the database server
	ordersLabel: string; // caption under the order counter
	boxLabel: string; // the backup box in the same building
	offLabel: string; // the far away region
	offSub: string;
	deadTag: string; // on the broken disk
	newTag: string; // on the replacement disk
	lostTag: string; // template with {n}, orders lost
	backTag: string; // template with {n}, orders brought back
	fireTag: string;
	/** The 3 2 1 rule, three short parts shown under the picture. */
	rule: [string, string, string];
	// the timeline of one busy day
	dailyLabel: string; // a backup once a day
	hourlyLabel: string; // a backup every hour
	startTime: string; // the left end of the day
	crashTime: string; // when the disk dies
	gapLabel: string; // the stretch with no copy
	/** Optional replay on the last beat. */
	pickLabel: string;
	plans: Record<BackupPlan, string>;
}
