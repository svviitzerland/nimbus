import type { LessonText } from '../../types';

export type LangId = 'machine' | 'c' | 'python';
export type JobLang = 'python' | 'js' | 'c';

export interface LanguagesText extends LessonText {
	/** The one task every version of the code does. */
	taskLabel: string;
	/** Shown before any language is picked. */
	pickHint: string;
	/** The three versions of the same program. */
	langs: Record<LangId, { name: string; sub: string; note: string }>;
	/** Meter captions. */
	humanMeter: string;
	machineMeter: string;
	/** Line count chip, template with {n}. */
	linesLabel: string;
	/** Opens the second part once all three were seen. */
	toJobs: string;
	/** Heading over the matching game, template with {n} and {total}. */
	jobsLabel: string;
	/** Names on the answer buttons. */
	jobLangs: Record<JobLang, string>;
	/** Each job and the language people usually reach for. */
	jobs: { id: string; text: string; answer: JobLang }[];
	wrongTag: string;
	rightTag: string;
	allDone: string;
	backToCode: string;
}
