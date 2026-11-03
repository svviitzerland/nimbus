import type { LessonText } from '../../types';

export interface AuthText extends LessonText {
	/** Labels for the two ways of remembering a visitor. */
	modeSession: string;
	modeToken: string;
	/** The three actions. */
	login: string;
	browse: string;
	deleteCookie: string;
	/** What the phone shows on each page. */
	page: {
		loginTitle: string;
		email: string;
		loginHint: string;
		hello: string;
		orders: string[];
		kickedTitle: string;
		kickedHint: string;
	};
	/** The cookie jar under the phone. */
	jarLabel: string;
	jarEmpty: string;
	/** What the token says inside, shown under it once decoded. */
	tokenInside: string;
	/** Caption over the request log. */
	logLabel: string;
	logIdle: string;
	noCookie: string;
	/** The server card. */
	serverLabel: string;
	sessionsLabel: string;
	sessionsEmpty: string;
	/** Who a session belongs to. */
	sessionOwner: string;
	tokenServer: string;
}
