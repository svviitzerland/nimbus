import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface WhyFrameworkText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** Names of the six pages of nimbus.com that all show the mug price. */
	pages: string[];
	/** Money template, {n} is the amount. */
	money: string;
	/** Label on the one place the price lives in the framework picture. */
	storeLabel: string;
	/** Warning when one page was missed. */
	bugNote: string;
	/** The optional button on the last beat. */
	lower: string;
	raise: string;
}
