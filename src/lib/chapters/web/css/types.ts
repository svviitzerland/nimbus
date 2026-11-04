import type { LessonText } from '../../types';

export interface CssText extends LessonText {
	/** One side panel step per intro beat, in the same order. */
	steps: { title: string; body: string; tag?: string }[];
	/** First line of the stylesheet, shown as a CSS comment. */
	comment: string;
	/** File name over the code and the address bar over the preview. */
	cssLabel: string;
	previewLabel: string;
	/** The page from the HTML lesson, its words only. */
	page: { heading: string; paragraph: string; button: string; alt: string };
	/** Label over the optional color swatches on the last beat. */
	tryLabel: string;
}
