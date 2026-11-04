import type { LessonText } from '../../types';

export interface IacText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	consoleTitle: string; // heading of the cloud website's create form
	sizeLabel: string;
	regionLabel: string;
	regionValue: string; // e.g. Jakarta
	createBtn: string;
	cloudLabel: string; // caption over the row of servers
	emptyLabel: string; // shown when no server exists
	countLabel: string; // caption next to the optional plus and minus buttons
	lessBtn: string; // accessible label for the minus button
	moreBtn: string; // accessible label for the plus button
}
