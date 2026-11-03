import type { LessonText } from '../../types';

export type JobKind = 'save' | 'email' | 'pdf';

export interface JobsText extends LessonText {
	/** The two ways the backend can handle a checkout. */
	modeDirect: string;
	modeQueue: string;
	checkout: string;
	rush: string;
	/** Worker stepper label. */
	workers: string;
	/** What the phone shows. */
	phone: { idle: string; waiting: string; done: string };
	/** Stopwatch caption, template with {s}. */
	waited: string;
	/** Name of each piece of work. */
	jobs: Record<JobKind, string>;
	/** Captions for the backend parts. */
	serverLabel: string;
	queueLabel: string;
	queueEmpty: string;
	workerLabel: string;
	idle: string;
	/** Small note on each order in the queue, template with {n}. */
	orderTag: string;
}
