import type { LessonText } from '../../types';

/** One candidate for the next token, with its chance in percent. */
export type Guess = [token: string, percent: number];

export interface LlmPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface LlmText extends LessonText {
	/** One panel per scene of the guided visual (nine scenes). */
	panels: LlmPanel[];
	/** Alt text for the whole picture. */
	picture: string;
	chatTitle: string;
	you: string;
	ai: string;
	/** The question the learner asks the chatbot on the first scene. */
	chatAsk: string;
	/** The start of the sentence the model keeps writing, words separated by spaces. */
	start: string;
	/** Three words the phone keyboard suggests after the start. */
	suggestions: string[];
	/** A sentence cut into tokens, each inner list is one word split into its pieces. */
	tokenWords: string[][];
	/** Template with {n}, how many tokens the sentence became. */
	tokensCount: string;
	/** Caption under the token numbers. */
	idsNote: string;
	/** Heading over the guess bars. */
	nextLabel: string;
	/** The tokens picked one by one on the loop scene, ending with a full stop. */
	path: string[];
	/** The tiny hand made "model", from the last word (lowercase) to its next guesses. */
	table: Record<string, Guess[]>;
	tempLabel: string;
	cold: string;
	hot: string;
	/** The rule of thumb shown on the remember scene. */
	rule: string;
	/** A short chat on the context window scene, you and the AI taking turns, starting with you.
	 * The first message (your name) falls out of the window before you ask about it. */
	contextChat: string[];
	/** The label on the frame around the messages the model can still read. */
	contextLabel: string;
	/** The note on messages that slid out of the window. */
	contextOut: string;
	/** The optional button on the last scene. */
	rollBtn: string;
}
