import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type JobKind = 'save' | 'email' | 'pdf';

export interface JobsText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	product: string;
	/** What the phone shows. */
	phone: { idle: string; waiting: string; done: string };
	/** Stopwatch line, template with {s}. */
	waited: string;
	/** Decimal mark for the stopwatch ("." or ","). */
	decimal: string;
	/** The three pieces of work a checkout needs. */
	tasks: Record<JobKind, string>;
	fast: string;
	slow: string;
	queued: string;
	backendLabel: string;
	queueLabel: string;
	workerLabel: string;
	/** The optional button on the last beat. */
	addBtn: string;
	resetBtn: string;
}
