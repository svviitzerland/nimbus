import type { LessonText } from '../../types';

export interface CompilerText extends LessonText {
	/** The program both translators get, one string per line (real code, shown as is). */
	code: string[];
	/** What each line prints on screen, null when it prints nothing. */
	output: (string | null)[];
	/** Which line (0 based) gets the typo, and how it looks with the typo. */
	typoLine: number;
	typoCode: string;
	compiler: { name: string; sub: string };
	interpreter: { name: string; sub: string };
	run: string;
	runAgain: string;
	addTypo: string;
	fixTypo: string;
	/** Compiler lane status lines. */
	compiling: string;
	ready: string; // the translated file is ready and saved
	reused: string; // a later run skips translating
	/** Interpreter lane status line, template with {n}. */
	readingLine: string;
	/** Shown when a lane finishes, template with {s} (seconds). */
	finishedIn: string;
	/** Error lines, template with {n} (line number). */
	errCompile: string;
	errInterp: string;
	screenLabel: string;
	waiting: string;
	noteIdle: string;
}
