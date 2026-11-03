import type { LessonText } from '../../types';

export type BuildStep = 'bundle' | 'minify' | 'compress';

export interface BuildToolsText extends LessonText {
	/** Caption over the source files and over the output. */
	srcLabel: string;
	outLabel: string;
	/** Name and one line meaning of each build step switch. */
	steps: Record<BuildStep, { label: string; sub: string }>;
	build: string;
	building: string;
	/** Result labels. */
	filesLabel: string;
	sizeLabel: string;
	loadLabel: string;
	/** Template with {s}, seconds on a slow phone. */
	loadValue: string;
	/** Shown in the output before the first build. */
	outEmpty: string;
	/** Toggle that shows a slice of code before and after minify. */
	peek: string;
	before: string;
	after: string;
}
