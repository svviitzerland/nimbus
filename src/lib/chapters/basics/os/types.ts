import type { LessonText } from '../../types';

/** The apps on the laptop. How much RAM each one takes lives in the stage. */
export type OsAppId = 'browser' | 'music' | 'chat' | 'game';

/** One part of the picture, shown in the side panel while its beats play. */
export type OsStep = { title: string; body: string };

export interface OsText extends LessonText {
	/** Panel text, one per scene (laptop, manager, opening, CPU, RAM, swap, files, names, play). */
	steps: OsStep[];
	apps: { id: OsAppId; name: string }[];
	osLabel: string; // the manager band between apps and hardware
	cpuLabel: string;
	ramLabel: string;
	diskLabel: string; // storage
	turn: string; // template with {app}, whose turn it is on the CPU
	ramUsed: string; // template with {n}, gigabytes in use out of 8
	slowTag: string; // badge on the laptop once RAM spills onto storage
	fileName: string; // the song the music app asks for
	osTrick: string; // the short memory line shown with the manager
	devices: { os: string; kind: string }[]; // Windows laptop, macOS laptop, Linux server, Android phone, iOS phone
	dockHint: string; // over the tappable apps in the play scene
	toggleLabel: string; // template with {app}, screen reader label to open or close an app
}
