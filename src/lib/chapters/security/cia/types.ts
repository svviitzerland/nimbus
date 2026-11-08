import type { LessonText } from '../../types';

/** The three letters of the triad. */
export type CiaLetter = 'c' | 'i' | 'a';
/** Every incident card, in the order the stage deals them. */
export type CiaCardId = 'yahoo' | 'laptop' | 'ap' | 'price' | 'dyn' | 'power';

export interface CiaText extends LessonText {
	/** The three buckets, the big letter is drawn by the stage. */
	buckets: Record<CiaLetter, { name: string; sub: string }>;
	pickHint: string; // tells the learner to tap a letter for the card shown
	/** Each incident, a small source tag (year or nimbus.com) and a headline. */
	cards: Record<CiaCardId, { tag: string; head: string }>;
	progress: string; // template with {n} and {total}
	missTag: string; // flashes on a wrong bucket
	allDone: string; // shown once every card is sorted
	again: string; // deals the cards again
}
