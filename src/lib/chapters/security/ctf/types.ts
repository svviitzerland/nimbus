import type { LessonText } from '../../types';

export type CtfChallengeId = 'caesar' | 'source' | 'password';

export interface CtfText extends LessonText {
	/** Scoreboard header, template with {n} (points) and {total}. */
	scoreLabel: string;
	points: string; // template with {n}
	solvedTag: string;
	/** Name and category of each challenge, plus its short brief. */
	challenges: Record<CtfChallengeId, { name: string; category: string; brief: string }>;
	/** The flag box. */
	flagLabel: string;
	flagPlaceholder: string;
	submitBtn: string;
	wrongFlag: string;
	rightFlag: string;
	allSolved: string;
	/** Caesar challenge. */
	shiftLabel: string; // template with {n}
	cipherLabel: string;
	plainLabel: string;
	/** Hidden comment challenge. */
	pageHeading: string;
	pageBody: string;
	viewPage: string;
	viewSource: string;
	/** Weak password challenge. */
	loginTitle: string;
	userLabel: string;
	wordlistLabel: string;
	wrongPass: string;
	welcome: string; // shown once the right password gets in, the flag follows it
}
