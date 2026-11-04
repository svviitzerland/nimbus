import type { LessonText } from '../../types';

export interface HtmlText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	/** Caption over the code editor. */
	editorLabel: string;
	/** Caption over the live preview. */
	previewLabel: string;
	/** The words on the page, wrapped in tags one by one as the beats go. */
	lines: {
		heading: string;
		paragraph: string;
		button: string;
		alt: string;
		/** The link text, and the form parts (the input placeholder and the form button). */
		link: string;
		email: string;
		join: string;
	};
	/** Where the link and the form send their request, shown on the little trip under the preview. */
	serverLabel: string;
	/** Small hint shown over the editor once it becomes editable. */
	editHint: string;
	/** Inline hint for a tag that was opened and never closed, template with {open} and {close}. */
	unclosedHint: string;
	/** Puts the finished page back. */
	reset: string;
}
