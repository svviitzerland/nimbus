import type { LessonText } from '../../types';

export type JsMissionId = 'count' | 'step' | 'broken' | 'fixed';

export interface JsText extends LessonText {
	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<JsMissionId, string>;
	/** Label over the helper chips, and the chip names. */
	chipsLabel: string;
	chips: { step: string; breakIt: string; fix: string };
	/** Tab names, the address bar, and the console. */
	jsLabel: string;
	htmlLabel: string;
	previewLabel: string;
	consoleLabel: string;
	consoleEmpty: string;
	/** Words on the little shop page. */
	page: { product: string; price: string; button: string; cart: string };
	/** First line of the script, shown as a code comment. */
	comment: string;
	/** Shown instead of running code that has a loop in it. */
	loopHint: string;
	/** Shown once every mission is done. */
	allDone: string;
	/** Puts the starter script back. */
	reset: string;
}
