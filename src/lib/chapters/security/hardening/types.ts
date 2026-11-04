import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

/** The six doors (ports) on the fresh server. */
export type HardenDoor = 'ftp' | 'ssh' | 'telnet' | 'web' | 'db' | 'test';

export interface HardeningText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** Caption under the server cabinet. */
	serverLabel: string;
	/** Caption over the bots on the left. */
	botsLabel: string;
	/** Caption under the scanner gauge. */
	scoreLabel: string;
	/** The software plate on the server, its name and the two states. */
	software: string;
	outdated: string;
	patched: string;
	/** Short name under each door (about 9 letters). */
	doors: Record<HardenDoor, string>;
	/** The optional toggle on the last beat. */
	reopen: string;
	reclose: string;
}
