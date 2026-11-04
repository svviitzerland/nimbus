import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface CtfText extends LessonText {
	/** Public domain photo of a Roman bust of Julius Caesar, shown on the cipher beat. */
	caesar: { alt: string; caption: string };
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** The little sign beside the flag on the permission beat. */
	sign: string;
	/** Caption over the scrambled note. */
	noteLabel: string;
	/** Caption over the two alphabet strips, {n} is how many places each letter moves. */
	stripCap: string;
	/** Label of the optional slider on the last beat, {n} is its value. */
	shiftLabel: string;
}
