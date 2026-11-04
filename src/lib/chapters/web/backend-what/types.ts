import type { LessonText } from '../../types';

/** One part of the side panel (title, one or two short sentences, an optional tag). */
export type GuideStep = { title: string; body: string; tag?: string };

export type BackendStationId = 'who' | 'stock' | 'save' | 'mail';

export interface BackendWhatText extends LessonText {
	/** Side panel parts, one per beat. */
	steps: GuideStep[];
	/** Captions over the two halves of the picture. */
	frontLabel: string;
	frontSub: string;
	backLabel: string;
	backSub: string;
	/** The same two captions on the memory trick beat. */
	roomFront: string;
	roomBack: string;
	/** The four drawers of the backend, in the order the order visits them. */
	stations: Record<BackendStationId, string>;
	/** What the phone shows. */
	product: string;
	price: string;
	buy: string;
	phone: { idle: string; waiting: string; done: string; rejected: string };
	dbLabel: string;
	mailLabel: string;
	apiLabel: string;
	/** The optional toggle on the last beat. */
	logoutBtn: string;
	loginBtn: string;
}
