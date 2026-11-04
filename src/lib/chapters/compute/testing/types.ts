import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface TestingText extends LessonText {
	/** Side panel parts, one per beat (ten). */
	steps: GuideStep[];
	/** Scene 0, checking pages by hand. */
	handLabel: string;
	pages: string[];
	forgotTag: string;
	/** The name written inside the test, as a short sentence. */
	testName: string;
	/** The result bar. {exp} and {got} are numbers. */
	idle: string;
	running: string;
	passed: string;
	failed: string;
	/** Scenes 3 and 4, the parts of a signup and the two kinds of test. */
	parts: string[];
	unitLabel: string;
	integrationLabel: string;
	/** Scene 5, the users are not touched yet. */
	usersSafe: string;
	/** Scene 6, a row of changes, each tested. */
	everyChange: string;
	/** Scene 8, popular test tools. */
	toolsLabel: string;
	/** The optional toggle on the last beat. */
	breakBtn: string;
	fixBtn: string;
}
