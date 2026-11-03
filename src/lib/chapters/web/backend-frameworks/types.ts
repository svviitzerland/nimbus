import type { LessonText } from '../../types';

export type ChoreId = 'route' | 'read' | 'validate' | 'security' | 'db' | 'respond';
export type FrameworkId = 'laravel' | 'express' | 'django' | 'spring';

export interface BackendFrameworksText extends LessonText {
	/** Tab for writing everything yourself. */
	byHand: string;
	/** Caption over the chore list. */
	choresLabel: string;
	/** Hint under the chores while writing by hand. */
	writeHint: string;
	/** One line per chore an order endpoint needs. */
	chores: Record<ChoreId, string>;
	/** Line counter, template with {n}. */
	lines: string;
	/** Badges on each chore when a framework is picked. */
	built: string;
	addon: string;
	/** What a chore shows by hand before it is written. */
	todo: string;
	/** Language and a one line description per framework. */
	frameworks: Record<FrameworkId, { lang: string; blurb: string }>;
}
