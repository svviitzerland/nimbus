import type { LessonText } from '../../types';

export interface WhyFrameworkText extends LessonText {
	/** The two ways to work, shown as tabs. */
	modes: { hand: string; framework: string };
	/** Instruction for each mode. */
	handHint: string;
	frameworkHint: string;
	/** Names of the ten places the price shows up. */
	places: string[];
	/** Money template, {n} is the amount. */
	money: string;
	/** Publish button for the by hand mode. */
	publish: string;
	/** Result lines after publishing, {n} is how many places were missed. */
	publishedOk: string;
	publishedMissed: string;
	/** Template with {n}, how many edits it took. */
	edits: string;
	/** Labels for the price stepper in framework mode. */
	priceLabel: string;
	cheaper: string;
	pricier: string;
	reset: string;
}
