import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type RenderMode = 'csr' | 'ssr' | 'ssg';

export interface RenderingText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** Short names of the three ways, used on the play buttons and the scene caption. */
	modes: Record<RenderMode, string>;
	youLabel: string;
	serverLabel: string;
	shelfLabel: string;
	/** Status line under the picture, one per moment of the story. */
	status: {
		build: string;
		where: string;
		ask: string;
		emptyHtml: string;
		jsBuilds: string;
		serverBuilds: string;
		fullHtml: string;
		hydrate: string;
		prebuilt: string;
		ready: string;
	};
	/** Shown once the content is on screen, {s} is the time in seconds. */
	readyAfter: string;
}
