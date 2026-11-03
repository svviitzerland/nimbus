import type { LessonText } from '../../types';

export interface ImageGenText extends LessonText {
	promptLabel: string; // caption over the prompt chips
	/** The three prompts, in order (mountains with a cloud, an orange cat, a small house). */
	prompts: string[];
	pickPrompt: string; // the prompt box before anything is picked
	stepBtn: string;
	autoBtn: string;
	seedBtn: string; // starts again from fresh noise
	stepLabel: string; // template with {n} and {total}
	noiseLabel: string; // template with {n}, percent of noise left
	sliderLabel: string; // aria label for the step slider
	canvasLabel: string; // aria label for the pixel canvas
	/** A short caption under the canvas for each phase. */
	phase: { noise: string; shapes: string; details: string; done: string };
}
