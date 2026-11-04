import type { LessonText } from '../../types';

export interface PwaPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface PwaText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes). */
	panels: PwaPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Caption over the server. */
	serverLabel: string;
	/** What the phone shows. */
	noInternet: string;
	installAsk: string;
	installBtn: string;
	appName: string;
	tagline: string;
	fromCache: string;
	fromServer: string;
	/** Captions for the cache box and the service worker. */
	cacheLabel: string;
	workerLabel: string;
	/** Memory trick tags over the two pieces. */
	memo: { manifest: string; worker: string };
	/** The rule of thumb line under the picture. */
	rule: string;
	/** The optional internet switch on the last beat. */
	offBtn: string;
	onBtn: string;
}
