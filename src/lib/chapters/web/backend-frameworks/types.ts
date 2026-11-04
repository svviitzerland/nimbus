import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type ChoreId = 'route' | 'read' | 'check' | 'guard' | 'db' | 'reply';

export interface BackendFrameworksText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** The editor window. */
	fileName: string;
	requestTag: string;
	emptyHint: string;
	/** Line counter, template with {n}. */
	lines: string;
	/** The chores one order endpoint needs, with how many lines each takes by hand. */
	chores: Record<ChoreId, { label: string; lines: number }>;
	/** Badge on a chore the framework does for you. */
	ready: string;
	/** The small block you still write yourself. */
	yourCode: string;
	yourLines: number;
	/** The frameworks shown in turn on the frame. */
	frameworks: { name: string; lang: string }[];
	/** The optional toggle on the last beat. */
	byHandBtn: string;
	frameworkBtn: string;
}
