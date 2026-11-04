import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface UiUxText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** The little shop on the phone. */
	site: string;
	product: string;
	price: string;
	buy: string;
	paid: string;
	/** Callouts around the phone while UI is in focus. */
	uiColor: string;
	uiFont: string;
	uiButton: string;
	/** The messy checkout. Two look alike buttons, a confusing label, and a surprise fee. */
	messy: { cancel: string; next: string; fee: string; total: string; flags: string[] };
	/** The clear checkout. One honest button and the full price up front. */
	clear: { pay: string; free: string; total: string; flags: string[] };
	/** The Norman door picture. */
	door: { sign: string; caption: string };
	/** The two tags on the remember part. */
	lookTag: string;
	feelTag: string;
	/** The optional toggle on the last beat. */
	showMessy: string;
	showClear: string;
}
