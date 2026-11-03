import type { LessonText } from '../../types';

export interface BrowserText extends LessonText {
	/** The step button, one label per step (ask for the page, then each file), then replay. */
	steps: [string, string, string, string];
	again: string;
	/** Caption for the file list, and a line while a file is downloading ({file}). */
	networkLabel: string;
	downloading: string;
	/** What each file is for, shown next to it. */
	fileRoles: { html: string; css: string; img: string; js: string };
	/** What the browser is doing after each step, from the empty tab to the running page. */
	work: [string, string, string, string, string];
	/** The empty tab before anything arrived. */
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
	/** Switches shown once the page is fully loaded. */
	cssToggle: string;
	jsToggle: string;
	on: string;
	off: string;
}
