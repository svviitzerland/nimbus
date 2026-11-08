import type { LessonText } from '../../types';

/** The short stories, in the order the stage tells them. */
export type HatScenarioId = 'lab' | 'wifi' | 'pentest' | 'extort' | 'warn' | 'bounty';
export type Hat = 'white' | 'gray' | 'black';

export interface HatColorsText extends LessonText {
	askLabel: string; // the question over every story
	legalBtn: string;
	illegalBtn: string;
	/** Each story, who is in it, what they do, and why it lands where it does. */
	scenarios: Record<HatScenarioId, { who: string; story: string; why: string }>;
	hats: Record<Hat, string>; // name of each hat
	legalTag: string; // verdict chip, legal
	illegalTag: string; // verdict chip, not legal
	rightTag: string; // the learner guessed right
	wrongTag: string; // the learner guessed wrong
	nextBtn: string;
	progress: string; // template with {n} and {total}
	scoreLine: string; // template with {n} and {total}, shown at the end
	doneLine: string; // the closing idea, shown at the end
	again: string; // tells the stories again
}
