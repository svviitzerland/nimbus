import type { LessonText } from '../../types';

export interface BrowserText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	/** Caption over the row of files arriving. */
	filesLabel: string;
	/** Caption over the DOM tree drawing. */
	domLabel: string;
	/** The empty tab before anything was painted. */
	blank: string;
	/** The nimbus.com page itself. */
	page: {
		nav: [string, string, string];
		heading: string;
		text: string;
		alt: string;
		like: string;
		tips: string[];
	};
	/** The optional CSS switch on the last beat. */
	cssToggle: string;
	on: string;
	off: string;
}
