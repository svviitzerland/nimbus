import type { LessonText } from '../../types';

export interface PwaText extends LessonText {
	/** The step row at the top. */
	steps: string[];
	/** Internet toggle. */
	internetOn: string;
	internetOff: string;
	/** Buttons, in the order they show up. */
	offBtn: string; // turn the internet off for the plain site
	onBtn: string; // turn it back on
	manifestBtn: string;
	workerBtn: string;
	installBtn: string;
	offAgainBtn: string;
	openAppBtn: string;
	/** What the phone shows. */
	noInternet: string;
	installBanner: string;
	fromCache: string;
	pageTagline: string;
	appName: string;
	/** The cache panel under the phone. */
	cacheLabel: string;
	cacheEmpty: string;
	/** Notes explaining the moment, one per step. */
	notes: {
		plain: string;
		plainOffline: string;
		addPieces: string;
		install: string;
		goOffline: string;
		openApp: string;
		done: string;
	};
}
