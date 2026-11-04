import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface CompilerText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** The small program both translators get, one string per line (real code, shown as is). */
	code: string[];
	/** What each line prints on screen, null when it prints nothing. */
	output: (string | null)[];
	/** Which line (0 based) gets the typo in the typo part, and how it looks with the typo. */
	typoLine: number;
	typoCode: string;
	/** Labels in the opening picture. */
	codeLabel: string;
	cpuLabel: string;
	translatorLabel: string;
	compiler: { name: string; sub: string };
	interpreter: { name: string; sub: string };
	fileName: string;
	screenLabel: string;
	/** Lane status lines. {n} is a line number. */
	waiting: string;
	compiling: string;
	saved: string;
	reused: string;
	running: string;
	readingLine: string;
	done: string;
	errCompile: string;
	errInterp: string;
	/** The Grace Hopper portrait. */
	hopper: { alt: string; name: string; caption: string; logbook: string };
	/** The optional toggle on the last beat. */
	addTypo: string;
	fixTypo: string;
}
