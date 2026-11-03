import type { LessonText } from '../../types';

/** The everyday things compared in the size part. Their byte counts live in the stage. */
export type SizeId = 'char' | 'chat' | 'photo' | 'song' | 'movie';

export interface BinaryText extends LessonText {
	/** Number formatting for switch counts, e.g. "id-ID" or "en-US". */
	locale: string;
	acts: string[]; // short names for the two parts, shown in the step row
	goal: string; // template with {c}, the letter to build
	sumLabel: string; // template with {n}, what the lit switches add up to
	letterIs: string; // lead in before the letter badge, e.g. "which means"
	noLetter: string; // the number is not a small letter
	hintHigh: string; // the sum is above the target
	hintLow: string; // the sum is below the target
	hintTap: string; // before any switch is flipped
	matched: string; // template with {c}, the letter is right
	helpBtn: string; // Nim flips the switches for the rest of the word
	wordLabel: string; // heading over the byte rows
	wordNote: string; // template with {b} bytes and {n} switches
	sizesBtn: string; // moves on to the size part
	sizePrompt: string;
	units: string; // what KB, MB, and GB mean
	switches: string; // template with {n}, how many switches a thing needs
	sizes: { id: SizeId; name: string; size: string }[];
	doneNote: string;
}
