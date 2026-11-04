import type { LessonText } from '../../types';

export interface CodeBasicsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface CodeBasicsText extends LessonText {
	/**
	 * One panel per scene, in story order (ten panels). Scenes are a variable box, changing its
	 * value, the jar memory trick, data types, a list, a contact card, a function, calling it,
	 * the rice cooker memory trick, and the optional play.
	 */
	panels: CodeBasicsPanel[];
	/** Small labels pointing at the label and the inside of a variable box. */
	nameTag: string;
	valueTag: string;
	/** The three data types, used as tags under the boxes and as code comments. */
	types: { number: string; text: string; bool: string };
	/** Note under the list, positions start at 0. */
	listNote: string;
	/** Heading of the contact card. */
	cardTitle: string;
	/** Note under the contact card, you look a value up by its key. */
	cardNote: string;
	/** Labels around the function machine. */
	inputTag: string;
	outputTag: string;
	/** What comes out of make_tea, {n} is the spoons of sugar. */
	teaOut: string;
	plainOut: string;
	/** Note under the calls, written once, used many times. */
	reuseNote: string;
	/** The rice cooker memory trick. */
	cooker: { input: string; button: string; output: string };
	/** The optional play on the last beat. */
	playHint: string;
	callButton: string;
}
