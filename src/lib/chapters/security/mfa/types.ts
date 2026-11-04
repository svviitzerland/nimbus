import type { LessonText } from '../../types';
import type { GuideStep } from '$lib/components/stages/secbasics/guided.svelte';

export type MfaFactor = 'know' | 'have' | 'are';
export type MfaStatus =
	| 'idle'
	| 'checking'
	| 'taken'
	| 'askCode'
	| 'guessing'
	| 'locked'
	| 'push'
	| 'yourTurn'
	| 'wrong'
	| 'welcome';

export interface MfaText extends LessonText {
	/** The side panel, one entry per beat. */
	steps: GuideStep[];
	attackerLabel: string;
	youLabel: string;
	phoneLabel: string;
	stolenChip: string;
	appName: string;
	appAccount: string;
	mfaOffChip: string;
	mfaOnChip: string;
	loginTitle: string;
	emailValue: string;
	codeField: string;
	loginBtn: string;
	/** The three kinds of proof, a short name and an everyday example. */
	factors: Record<MfaFactor, { name: string; ex: string }>;
	/** The ATM version of know and have (beat 3). */
	atm: { know: string; have: string };
	keyLabel: string;
	approvePrompt: string;
	approveYes: string;
	approveNo: string;
	/** What the login screen says, {code} is filled with a guess. */
	status: Record<MfaStatus, string>;
	codeHint: string;
	submitBtn: string;
}
