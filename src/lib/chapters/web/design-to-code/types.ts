import type { LessonText } from '../../types';

export type DesignProp = 'color' | 'radius' | 'padding' | 'font';

export interface DesignToCodeText extends LessonText {
	/** Caption over the designer's frame. */
	designLabel: string;
	/** Caption over the learner's page. */
	pageLabel: string;
	/** The button text drawn in both. */
	button: string;
	/** Button that reveals the spec values in the design. */
	inspect: string;
	/** Heading of the spec panel. */
	specLabel: string;
	/** Human names for each property. */
	props: Record<DesignProp, string>;
	/** Hint shown before inspecting. */
	inspectHint: string;
	/** Caption over the CSS editor. */
	codeLabel: string;
	/** Shown under the controls when everything matches. */
	matched: string;
	/** Live score, template with {n} and {total}. */
	score: string;
}
