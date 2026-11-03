import type { LessonText } from '../../types';

export interface MfaText extends LessonText {
	attackerLabel: string; // who sits at the laptop
	attackerSub: string;
	stolenChip: string; // the password he already holds
	phoneLabel: string; // your phone
	appName: string; // the authenticator app title
	appAccount: string; // which account the code is for
	secondsLeft: string; // template with {n}
	mfaOffChip: string;
	mfaOnChip: string;
	loginTitle: string; // header of the login card
	emailField: string;
	passwordField: string;
	codeField: string;
	attackBtn: string; // the attacker logs in, MFA off
	mfaOnBtn: string; // switch MFA on
	attackAgainBtn: string; // the attacker tries again, MFA on
	codePrompt: string; // asks the learner to type the code from the phone
	submitBtn: string;
	status: {
		idle: string;
		checking: string;
		taken: string;
		askCode: string;
		guessing: string; // template with {code}
		locked: string;
		yourTurn: string;
		wrong: string;
		welcome: string;
	};
}
