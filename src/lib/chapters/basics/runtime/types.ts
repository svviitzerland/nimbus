import type { LessonText } from '../../types';

export type FeatureId = 'login' | 'payments' | 'charts';

export interface RuntimeText extends LessonText {
	/** Names of the three steps, shown in the step row. */
	steps: string[];
	/** The layers of the stack, top to bottom. */
	layers: { code: string; libs: string; runtime: string; os: string; hw: string };
	osNote: string;
	hwNote: string;
	appName: string; // the app on the top layer
	appUp: string;
	appDown: string;
	appOff: string;
	notInstalled: string;
	noLibs: string;
	/** Step 1. */
	runBtn: string;
	installBtn: string;
	installing: string; // terminal line while installing
	installed: string; // terminal line once installed
	/** Step 2. */
	features: Record<FeatureId, { name: string; days: number; lines: number }>;
	scratchBtn: string; // template with {n} days
	libBtn: string; // template with {lib}
	wroteChip: string; // shown on a feature you wrote yourself
	linesLabel: string; // template with {n}
	daysLabel: string; // template with {n}
	secondsLabel: string;
	toUpdate: string;
	needLib: string;
	/** Step 3. */
	updateBtn: string;
	pinBtn: string; // template with {lib} and {v}
	runningAgain: string;
	fixedNote: string;
}
