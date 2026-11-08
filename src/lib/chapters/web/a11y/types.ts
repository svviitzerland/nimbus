import type { LessonText } from '../../types';

export type A11yMissionId = 'alt' | 'label' | 'button' | 'contrast';
export type A11yFixId = 'alt' | 'label' | 'button';

export interface A11yText extends LessonText {
	/** Heading over the mission list. */
	missionsLabel: string;
	/** One line per mission, in order. */
	missions: Record<A11yMissionId, string>;
	/** Controls over the page. */
	blindfold: string;
	next: string;
	restart: string;
	voice: string;
	/** Language for the optional spoken voice, like en-US. */
	voiceLang: string;
	/** The reader panel. */
	readerLabel: string;
	readerIdle: string;
	/** Shown over the page while the blindfold is on. */
	cover: string;
	/** Words a screen reader adds after each piece. */
	roles: { image: string; heading: string; editText: string; button: string };
	blank: string;
	skipped: string;
	endOfPage: string;
	/** Words on the signup page. */
	page: { heading: string; tagline: string; email: string; subscribe: string; alt: string };
	/** The fix button, and what each fix does. */
	fixLabel: string;
	fixes: Record<A11yFixId, string>;
	/** The contrast checker, with {n} for the ratio. */
	contrastLabel: string;
	ratio: string;
	need: string;
	darker: string;
	/** Shown once every mission is done. */
	allDone: string;
}
