import type { LessonText } from '../../types';

export type TeaStepId = 'cup' | 'boil' | 'bag' | 'pour' | 'stir';

export interface ProgramText extends LessonText {
	/** Heading over the program list. */
	programLabel: string;
	/** Heading over the chips of steps that are not in the program yet. */
	paletteLabel: string;
	/** Shown when the program has no steps. */
	emptyProgram: string;
	/** Each step, written like a command. */
	steps: Record<TeaStepId, string>;
	run: string;
	running: string;
	reset: string;
	moveUp: string;
	moveDown: string;
	remove: string;
	/** Caption under the kitchen while nothing has run yet. */
	noteIdle: string;
	/** Caption while a line runs, template with {n}. */
	noteLine: string;
	/** How each run can end. */
	notes: { spill: string; empty: string; plain: string; cold: string; tea: string };
	/** Small tags drawn in the kitchen. */
	cupTag: string;
	tableTag: string;
}
