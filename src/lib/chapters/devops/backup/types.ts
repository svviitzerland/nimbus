import type { LessonText } from '../../types';

export type BackupPlace = 'original' | 'disk2' | 'nas' | 'cloud';

export interface BackupText extends LessonText {
	/** Short names for the two acts, shown as tabs at the top. */
	acts: string[];
	nextAct: string;
	// Act 1, a busy day then a dead disk
	dbLabel: string; // the database server
	ordersLabel: string; // caption under the order counter
	backupLabel: string; // the backup drive
	lastCopy: string; // template with {t}, when the newest copy was made
	noCopy: string; // before the day starts
	scheduleLabel: string;
	daily: string; // back up once a day, at midnight
	hourly: string; // back up every hour
	runBtn: string;
	crashBtn: string;
	restoreBtn: string;
	againBtn: string;
	lostTag: string; // template with {n}, orders lost
	backTag: string; // template with {n}, orders brought back
	noteIdle: string;
	noteRunning: string;
	noteLive: string;
	noteDead: string;
	noteDaily: string;
	noteHourly: string;
	// Act 2, the 3 2 1 rule
	siteLabel: string; // the main data center
	siteSub: string;
	offLabel: string; // the far away region
	offSub: string;
	places: Record<BackupPlace, string>;
	kinds: Record<BackupPlace, string>; // the kind of storage, shown small
	originalTag: string;
	pickHint: string; // pick two more copies
	checkCopies: string; // template with {n}
	checkKinds: string; // template with {n}
	checkOff: string;
	fireBtn: string;
	resetBtn: string;
	fireTag: string; // shown over the burning building
	noteLost: string;
	noteSafe: string;
}
