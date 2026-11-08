import type { LessonText } from '../../types';

/** Every unneeded open door on the fresh server, in the order the scanner lists them. */
export type HardenDoor = 'update' | 'telnet' | 'db' | 'sshkey' | 'root' | 'default';

export interface HardeningText extends LessonText {
	serverLabel: string; // caption on the server card, the nimbus.com server
	scanBtn: string; // runs the scanner for the first time
	scoreLabel: string; // heading over the security score
	/** Each open door, what it is, why it is risky, the fix button, and the line once fixed. */
	doors: Record<HardenDoor, { name: string; risk: string; fix: string; done: string }>;
	/** The one door that must stay open, the HTTPS port visitors use. */
	web: { name: string; note: string; close: string; reopen: string; closedNote: string };
	openTag: string;
	closedTag: string;
	neededTag: string;
	siteUp: string;
	siteDown: string;
	hintIdle: string; // before the first scan
	hintScan: string; // after the scan, while doors are open
	hintDone: string; // every unneeded door is closed
}
