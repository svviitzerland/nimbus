import type { LessonText } from '../../types';

export type LangId = 'machine' | 'c' | 'python';
export type JobId = 'data' | 'web' | 'speed' | 'phone';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface LanguagesText extends LessonText {
	/** One panel per scene of the guided visual (seven scenes). */
	panels: GuidePanel[];
	/** The one task every version of the code does. */
	taskLabel: string;
	/** Name and a short hint for each version of the code. */
	langs: Record<LangId, { name: string; sub: string }>;
	/** Ends of the "easy for people versus close to the machine" arrow. */
	people: string;
	machine: string;
	/** Small label on the chip drawing. */
	cpu: string;
	/** Each job and the language people usually reach for. */
	jobs: Record<JobId, { lang: string; job: string }>;
	/** Rule of thumb line under the toolbox. */
	rule: string;
}
