import type { LessonText } from '../../types';

export interface ReleaseText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	lbLabel: string; // the load balancer in the middle
	usersLabel: string; // accessible label for the row of phones
	errors: string; // template with {n}, users seeing an error out of ten
	allOk: string; // nobody sees an error
	rule: string; // the rule of thumb line on the memory beat
	pickLabel: string; // caption over the optional buttons
	bigbangBtn: string;
	canaryBtn: string;
}
