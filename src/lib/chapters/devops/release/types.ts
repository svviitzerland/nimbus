import type { LessonText } from '../../types';

export interface ReleaseText extends LessonText {
	/** The three strategies, shown as tabs (all at once, blue green, canary). */
	modes: string[];
	usersLabel: string; // template with {n}, users hitting errors
	allOk: string; // nobody hits an error
	lbLabel: string; // the load balancer in the middle
	blueLabel: string; // blue environment, runs v1
	greenLabel: string; // green environment, runs v2
	liveTag: string; // marks the environment taking traffic
	deployAllBtn: string;
	rollbackBtn: string;
	rollingBack: string; // shown while the slow rollback runs
	switchToGreen: string;
	switchToBlue: string;
	canaryLabel: string; // template with {n}, share of users on v2
	canaryBack: string; // send every canary user back to v1
	bugNote: string; // reminds the learner that v2 has a hidden bug
}
