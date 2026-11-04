import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

export type SsoScope = 'name' | 'email' | 'photo';

export interface SsoText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	/** The five sites that fall like dominoes on the first beat. */
	sites: [string, string, string, string, string];
	signInTitle: string;
	googleBtn: string;
	orPassword: string;
	emailField: string;
	passwordField: string;
	/** The old, bad way (a site asking for your email password). */
	badTitle: string;
	badField: string;
	badSub: string;
	googleTitle: string;
	googleSub: string;
	googleEmail: string;
	nextBtn: string;
	consentTitle: string;
	scopes: Record<SsoScope, string>;
	allowBtn: string;
	welcomeTitle: string;
	welcomeSub: string;
	gotTitle: string;
	tokenChip: string;
	passwordRow: string;
	neverTag: string;
	/** The office apps that open after one login (the fyi beat). */
	apps: [string, string, string];
	revokeBtn: string;
	revokedTitle: string;
	revokedNote: string;
}
