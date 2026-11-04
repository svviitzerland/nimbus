import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export interface AuthText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	serverLabel: string;
	/** What the phone shows on each page. */
	page: {
		loginTitle: string;
		email: string;
		loginBtn: string;
		hello: string;
		ordersLabel: string;
		orders: string[];
		whoTitle: string;
		whoHint: string;
	};
	/** Under the phone, what the browser is holding. */
	sessionNumber: string;
	wristband: string;
	noCookie: string;
	/** The board under the server. */
	listLabel: string;
	listRows: { number: string; name: string }[];
	tokenLabel: string;
	tokenNote: string;
	hashLabel: string;
	hashUser: string;
	hashValue: string;
	/** The optional toggle on the last beat. */
	deleteBtn: string;
	againBtn: string;
}
