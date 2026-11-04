import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type BuildStep = 'bundle' | 'minify' | 'compress';

export interface BuildToolsText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	srcLabel: string;
	outLabel: string;
	toolLabel: string;
	/** Short names of the three jobs, shown under the machine. */
	jobs: Record<BuildStep, string>;
	/** The meter under the picture. {n} is a number. */
	tripsTpl: string;
	sizeLabel: string;
	kbTpl: string;
	/** The optional toggle on the last beat. */
	turnOff: string;
	turnOn: string;
}
