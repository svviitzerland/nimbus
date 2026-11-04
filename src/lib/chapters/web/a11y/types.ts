import type { LessonText } from '../../types';

export interface A11yText extends LessonText {
	/** One side panel step per intro beat, in the same order. */
	steps: { title: string; body: string; tag?: string }[];
	/** File name over the code and the address bar over the page. */
	htmlLabel: string;
	previewLabel: string;
	/** The caption strip that shows what the screen reader says. */
	readerLabel: string;
	readerIdle: string;
	roles: { image: string; heading: string; editText: string; button: string };
	blank: string;
	/** Shown when the reader jumps past a clickable box that is not a real button. */
	skipped: string;
	endOfPage: string;
	/** BCP 47 voice for the optional read aloud while blindfolded. */
	voiceLang: string;
	/** Words on the signup page. */
	page: { heading: string; tagline: string; email: string; subscribe: string; alt: string };
	/** The contrast meter, `ratio` is a template with {n}. */
	contrastLabel: string;
	ratio: string;
	need: string;
	/** The optional blindfold on the last beat. */
	blindfold: string;
	cover: string;
}
