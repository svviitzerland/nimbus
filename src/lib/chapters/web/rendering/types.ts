import type { LessonText } from '../../types';

export type RenderMode = 'csr' | 'ssr' | 'ssg';

export interface RenderingText extends LessonText {
	/** Short button label and a one line meaning for each mode. */
	modes: Record<RenderMode, { label: string; sub: string }>;
	/** The slow phone switch. */
	slow: string;
	youLabel: string;
	serverLabel: string;
	/** Caption on the server when the page is already built (SSG). */
	shelfLabel: string;
	/** What is happening, shown under the scene while a load plays. */
	steps: {
		ask: string;
		emptyHtml: string;
		downloadJs: string;
		jsBuilds: string;
		serverBuilds: string;
		fullHtml: string;
		hydrate: string;
		prebuilt: string;
		ready: string;
	};
	idle: string;
	/** Scoreboard heading and its template, {s} is seconds. */
	scoreLabel: string;
	firstPaint: string;
	/** Marks a score that was measured with slow phone switched off. */
	fastTag: string;
	notYet: string;
}
