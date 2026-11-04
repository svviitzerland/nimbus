import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface LearningLoopText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: GuidePanel[];
	axisKnob: string; // label under the hill, the one knob (weight) being tuned
	axisError: string; // label beside the hill, how wrong the model is
	lowest: string; // small flag at the bottom of the valley
	errorLabel: string; // caption of the "how wrong" bar
	stepN: string; // template with {n}, while the ball is stepping
	bottom: string; // template with {n}, once it settles at the bottom
	far: string; // template with {n}, when tiny steps run out far from the bottom
	flew: string; // once the ball leaves the hill
	rule: string; // the rule of thumb shown on the remember scene
	/** The three step sizes of the try it scene, tiny, just right, giant. */
	sizes: string[];
	sizeLabel: string; // template with {x}, the step size playing now
	another: string; // the optional button that switches the step size
}
