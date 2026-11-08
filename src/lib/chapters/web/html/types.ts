import type { LessonText } from '../../types';

export type HtmlMissionId = 'heading' | 'paragraph' | 'button' | 'image';

export interface HtmlText extends LessonText {
	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<HtmlMissionId, string>;
	/** Label over the tag chips. */
	chipsLabel: string;
	/** Caption over the code editor. */
	editorLabel: string;
	/** Caption over the live preview. */
	previewLabel: string;
	/** What the editor holds at the start, plain text with no tags yet. */
	starter: string;
	/** Text dropped inside each snippet when a chip is tapped. */
	snippets: { heading: string; paragraph: string; button: string; link: string; alt: string };
	/** Inline hint for a tag that was opened and never closed, template with {open} and {close}. */
	unclosedHint: string;
	/** Shown once every mission is done. */
	allDone: string;
	/** Puts the starter text back. */
	reset: string;
}
