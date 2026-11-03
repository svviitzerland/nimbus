import type { LessonText } from '../../types';

export type CssMissionId = 'background' | 'color' | 'font' | 'button';

export interface CssText extends LessonText {
	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<CssMissionId, string>;
	/** Label over the value chips for the current mission. */
	tryLabel: string;
	/** Label over the extra chips shown once every mission is done. */
	extraLabel: string;
	/** Tab names and the address bar. */
	cssLabel: string;
	htmlLabel: string;
	previewLabel: string;
	/** The page from the HTML lesson, its words only. */
	page: { heading: string; paragraph: string; button: string; alt: string };
	/** First line of the stylesheet, shown as a CSS comment. */
	starterComment: string;
	/** Inline hint for a line the browser skipped, template with {line}. */
	typoHint: string;
	/** Shown once every mission is done. */
	allDone: string;
	/** Puts the starter stylesheet back. */
	reset: string;
}
