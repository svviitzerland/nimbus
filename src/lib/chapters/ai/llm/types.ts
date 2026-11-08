import type { LessonText } from '../../types';

/** One candidate for the next token, with a raw score (bigger means more likely). */
export type Guess = [token: string, weight: number];

export interface LlmText extends LessonText {
	contextLabel: string;
	contextNote: string;

	inputLabel: string; // aria label for the sentence box
	presets: string[]; // starter sentences, the first one is loaded at the start
	tokensCount: string; // template with {n}, how many tokens the sentence became
	idsNote: string; // caption under the token chips, the numbers are what the model sees
	nextTitle: string; // heading over the guess bars
	tempLabel: string;
	tempCold: string; // left end of the temperature slider
	tempHot: string; // right end of the temperature slider
	pickBtn: string;
	full: string; // the sentence got too long to keep going
	reset: string;
	/** Hand made splits for words the tiny tokenizer cuts into pieces. Keys are lowercase. */
	splits: Record<string, string[]>;
	/** The whole "model", a hand made table from the last word (lowercase) to its next guesses. */
	table: Record<string, Guess[]>;
	/** Used when the last word is not in the table. */
	fallback: Guess[];
}
