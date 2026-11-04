import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface RuntimeText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** The layers of the stack, top to bottom. */
	layers: { code: string; runtime: string; os: string; hw: string };
	osNote: string;
	hwNote: string;
	/** Runtimes shown in turn on the runtime layer, with what each one runs. */
	runtimes: { name: string; note: string }[];
	/** The three library bricks (the third one arrives through the package manager). */
	libs: string[];
	/** The command the little terminal types for the third brick (real command, shown as is). */
	installCmd: string;
	installDone: string;
	appName: string;
	appUp: string;
	appDown: string;
	appOff: string;
	/** The version lock part. */
	newVersion: string;
	oldVersion: string;
	/** The optional toggle on the last beat. */
	removeBtn: string;
	returnBtn: string;
}
