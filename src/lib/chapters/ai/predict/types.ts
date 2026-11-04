import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface PredictText extends LessonText {
	/** One panel per beat of the guided visual (seven beats). */
	panels: GuidePanel[];
	regX: string; // axis, house size
	regY: string; // axis, price
	clsX: string; // axis, links in the email
	clsY: string; // axis, exclamation marks
	/** A price on the scale, template with {p} (a plain number). */
	price: string;
	/** A house size, template with {n} square metres. */
	size: string;
	spam: string;
	ham: string; // not spam
	/** Captions under the two small pictures on the memory beats. */
	answerNumber: string;
	answerGroup: string;
	/** Rule of thumb on the memory beat. */
	rule: string;
	/** Label of the optional size slider on the last beat. */
	slider: string;
}
