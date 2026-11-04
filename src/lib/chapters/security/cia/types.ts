import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

/** The three letters of the triad. */
export type CiaLetter = 'c' | 'i' | 'a';

export interface CiaText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	/** Each letter, a short everyday word (the memory trick) and its real name. */
	letters: Record<CiaLetter, { short: string; name: string }>;
	/** The diary in the picture, its title, one line, and the amount before and after the edit. */
	diary: { title: string; line: string; amount: string; amountBad: string };
	/** The real incident told on each tale beat, a small tag (who and when) and a headline. */
	news: Record<CiaLetter, { tag: string; head: string }>;
	/** The tool that guards each letter, shown under the badges on the tools beat. */
	tools: Record<CiaLetter, string>;
	/** Hint over the visual on the last beat (tap a letter to replay its story). */
	pickHint: string;
}
