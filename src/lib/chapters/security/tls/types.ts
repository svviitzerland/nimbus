import type { LessonText } from '../../types';

/** Which WiFi the optional switch on the last beat uses. */
export type TlsWifi = 'home' | 'cafe';

export interface TlsText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	youLabel: string;
	serverLabel: string;
	attackerLabel: string;
	/** Labels on the messages that travel along the wire. */
	chips: { hello: string; cert: string; key: string };
	/** The certificate as the browser shows it while checking. */
	certHeading: string;
	/** The three things the browser checks, in order. */
	checks: [string, string, string];
	sessionKey: string; // caption under the shared session key
	warnTitle: string; // the warning page the browser shows
	warnBody: string;
	/** The little history line on the second beat, one entry per dot. */
	history: { name: string; year: string }[];
	/** The optional switch on the last beat. */
	wifi: { label: string; home: string; cafe: string };
}
