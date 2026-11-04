import type { LessonText } from '../../types';

/** One era on the timeline, shown in the side panel. */
export interface HistoryEra {
	mark: string; // short label above the timeline dot, e.g. "1945"
	title: string;
	body: string; // one or two plain sentences, <b> allowed
}

/** A framed public domain photo (files live in static/images/people/). */
export interface HistoryPhoto {
	alt: string;
	caption: string; // the name and the year the photo was taken
}

export interface HistoryText extends LessonText {
	/**
	 * Thirteen eras in order: abacus, human computers, Babbage and Lovelace, Turing's idea,
	 * Bletchley Park, ENIAC, transistor, Grace Hopper, microchip, personal computer, web,
	 * smartphone, today. The stage maps beat 0 to 11 onto eras 0 to 11, the last beats onto "today".
	 */
	eras: HistoryEra[];
	photos: {
		babbage: HistoryPhoto;
		lovelace: HistoryPhoto;
		turing: HistoryPhoto;
		eniac: HistoryPhoto;
		hopper: HistoryPhoto;
	};
	/** Accessible label for the timeline. */
	timeline: string;
}
