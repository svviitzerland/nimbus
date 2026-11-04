import type { LessonText } from '../../types';

/** The four kinds of answer the stage can show, one per first digit of the status code. */
export type HttpKind = 'ok' | 'moved' | 'notfound' | 'broken';

export interface HttpText extends LessonText {
	/** The side panel, one entry per beat (title, a short plain explanation, a small tag). */
	steps: { tag: string; title: string; body: string }[];
	youLabel: string;
	serverLabel: string;
	/** What the browser screen shows while waiting, and for each kind of answer. */
	screen: {
		loading: string;
		results: Record<HttpKind, { title: string; text: string }>;
	};
	/** The rule of thumb row, one short label per first digit (2, 3, 4, 5). */
	legend: [string, string, string, string];
	/** Caption over the optional page buttons on the last beat. */
	pagesLabel: string;
	/** The URL beat, the query part of the sample address and the label under each part. */
	urlQuery: string;
	urlParts: { scheme: string; domain: string; path: string; query: string };
}
