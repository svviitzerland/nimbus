import type { LessonText } from '../../types';

/** The apps on the laptop. How much RAM each one takes lives in the stage. */
export type OsAppId = 'browser' | 'music' | 'chat' | 'game';

export interface OsText extends LessonText {
	dockHint: string; // over the row of apps
	apps: { id: OsAppId; name: string }[];
	desktopEmpty: string; // the screen before any app is open
	osLabel: string; // the manager layer
	osSub: string;
	cpuLabel: string;
	turn: string; // template with {app}, whose turn it is on the CPU
	cpuIdle: string; // nothing open, the CPU waits
	ramLabel: string;
	ramUsed: string; // template with {n}, gigabytes in use out of 8
	osChunk: string; // the slice of RAM the OS keeps for itself
	swapLabel: string; // the overflow pushed onto storage
	closeLabel: string; // template with {app}, screen reader label on a window's close button
	slowTag: string; // badge on the laptop once it struggles
	notes: {
		idle: string;
		one: string;
		sharing: string;
		slow: string;
		eased: string;
	};
}
