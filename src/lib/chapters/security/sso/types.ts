import type { LessonText } from '../../types';

/** What nimbus.com may ask Google for. Name and email are always needed. */
export type SsoScope = 'name' | 'email' | 'photo' | 'contacts' | 'drive';

export interface SsoText extends LessonText {
	signInTitle: string; // the nimbus.com login page
	googleBtn: string; // the "sign in with Google" button
	orPassword: string; // the greyed out alternative, yet another password
	googleTitle: string; // Google's own sign in page
	googleSub: string;
	googleEmail: string;
	passwordField: string;
	nextBtn: string;
	consentTitle: string; // "nimbus.com wants to"
	scopes: Record<SsoScope, string>;
	requiredTag: string; // marks the scopes that cannot be switched off
	allowBtn: string;
	returning: string; // shown while the phone heads back to nimbus.com
	welcomeTitle: string;
	welcomeSub: string;
	gotTitle: string; // heading over what nimbus.com received
	tokenChip: string; // the access token itself
	passwordRow: string; // your Google password
	neverTag: string; // the password was never shared
	notSharedTag: string; // a scope you kept back
	revokeBtn: string;
	revokedNote: string;
	hints: { start: string; google: string; consent: string; done: string };
}
