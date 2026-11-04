import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type DesignProp = 'color' | 'radius' | 'padding' | 'font';

export interface DesignToCodeText extends LessonText {
	/** Side panel parts, one per beat (the last beat reuses the last part). */
	steps: GuideStep[];
	/** Caption over the designer's frame. */
	designLabel: string;
	/** Caption over the browser that shows the coded page. */
	pageLabel: string;
	/** The button text drawn in both (keep it short, about 10 letters). */
	button: string;
	/** Heading of the inspect panel. */
	specLabel: string;
	/** Human names for each property in the inspect panel. */
	props: Record<DesignProp, string>;
	/** Design system names for the same values, shown in the design system part. */
	tokens: Record<DesignProp, string>;
	/** Caption over the CSS editor. */
	codeLabel: string;
	/** Badge when the page matches the design, and when it does not. */
	matched: string;
	mismatch: string;
	/** The optional toggle on the last beat. */
	skipPadding: string;
	restorePadding: string;
}
