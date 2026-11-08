import type { LessonText } from '../../types';

export interface LearningLoopText extends LessonText {
	axisWeight: string; // label under the hill, the one weight being tuned
	axisError: string; // label beside the hill, how wrong the network is
	lowest: string; // small flag at the bottom of the valley
	stepBtn: string; // take one step downhill
	rollBtn: string; // let the ball keep stepping by itself
	rolling: string; // template with {n}, while it rolls by itself
	reset: string;
	rateLabel: string; // caption of the learning rate slider
	rateLow: string; // slider end, tiny steps
	rateHigh: string; // slider end, giant leaps
	/** Tags for the current step size, from tiny to wild (4 items). */
	rateTags: string[];
	errorLabel: string; // caption of the error meter
	steps: string; // template with {n}, the step counter
	slopeHint: string; // explains the little arrow before the first step
	flew: string; // status once the ball leaves the hill
	bottom: string; // template with {n}, status once it reaches the bottom
}
