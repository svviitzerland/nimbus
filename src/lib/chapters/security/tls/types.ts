import type { LessonText } from '../../types';

export interface TlsText extends LessonText {
	/** Short names for the two acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}
	nextAct: string;
	youLabel: string;
	serverLabel: string;
	/** Act 1, the handshake. */
	stepBtn: string; // plays the next handshake step
	/** Five steps, in order hello, cert, check, key, secure. `chip` rides the wire (empty for none). */
	steps: { chip: string; title: string; body: string }[];
	/** The four things the browser checks on the certificate. */
	checks: string[];
	cert: {
		heading: string;
		subjectLabel: string;
		issuerLabel: string;
		validLabel: string;
		keyLabel: string;
		subject: string; // nimbus.com
		issuer: string; // Let's Encrypt
		valid: string; // a date
		keyValue: string; // a short public key preview
	};
	sessionKey: string; // caption on the shared session key
	secretMsg: string; // the page content travelling once secure
	/** Act 2, the impostor on a shady WiFi. */
	wifiLabel: string;
	attackerLabel: string;
	visitBtn: string;
	addr: string; // what the address bar shows
	warn: {
		title: string;
		body: string;
		back: string;
		proceed: string;
		details: string; // heading over the fake certificate
	};
	fakeIssuer: string; // the fake certificate signed by itself
	fakeValid: string;
	fakeChecks: string[]; // short status per check, same order as `checks`
	stolen: string; // shown when the learner proceeds anyway
	safe: string; // shown when the learner turns back
	again: string; // try the fake site again
}
