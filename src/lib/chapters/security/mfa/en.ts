import type { MfaText } from './types';

export const en: MfaText = {
	title: 'What is MFA',
	intro: [
		'Imagine someone already knows your password. Maybe it [[leaked from a careless shop|security/hashing]], maybe you typed it into a fake page. Is it game over?',
		'Not if there is a second lock. <b>MFA</b> (multi factor authentication) asks for a second proof of a different kind. Something you <b>know</b> (a password), something you <b>have</b> (your phone or a small key), or something you <b>are</b> (a fingerprint or your face).',
		'You already use it. At an ATM the card is something you have and the PIN is something you know. A thief holding only one of them walks away with no money. That is MFA from long before the internet.',
		'Online, the second proof is usually a six digit code from an <b>authenticator app</b> that changes every 30 seconds, or a small USB <b>security key</b> you tap.',
		'It works. In 2018 Google shared that since early 2017, when it gave security keys to its more than 85 thousand employees, not one of their work accounts had been taken over by phishing.',
		'[fyi] MFA is not magic though. In 2022 an attacker who had the password of an Uber contractor kept sending login approval requests to his phone, then messaged him pretending to be IT support, until he tapped approve. Never approve a login you did not start yourself.',
		"Let's see it. An attacker already has your nimbus.com password. Watch what happens with MFA off, then with MFA on."
	],
	reactions: {
		noMfa:
			'Way too easy. With only a password on the door, whoever holds that password is you, as far as nimbus.com can tell. Turn MFA on and let him try again.',
		stuck:
			'Stuck. The password was right, but the code lives on your phone, and your phone is in your pocket. Guessing six digits is one chance in a million, and the code changes every 30 seconds anyway. Now log in yourself.',
		wrongCode:
			'Not that one. Look at the app on your phone and type the six digits it shows right now.',
		you: 'Welcome back. You had both, the password in your head and the phone in your hand. That is all MFA asks of you, and it stops most stolen password attacks cold.'
	},
	attackerLabel: 'Attacker',
	attackerSub: 'far away',
	stolenChip: 'has your password',
	phoneLabel: 'Your phone',
	appName: 'Authenticator',
	appAccount: 'nimbus.com, your account',
	secondsLeft: '{n}s',
	mfaOffChip: 'MFA off',
	mfaOnChip: 'MFA on',
	loginTitle: 'nimbus.com login',
	emailField: 'email',
	passwordField: 'password',
	codeField: 'code',
	attackBtn: 'Attacker logs in',
	mfaOnBtn: 'Turn on MFA',
	attackAgainBtn: 'Attacker tries again',
	codePrompt: 'Your turn. Type the code from your phone',
	submitBtn: 'Log in',
	status: {
		idle: 'The login page is open on his laptop',
		checking: 'Checking the password',
		taken: 'Logged in. The account is his now',
		askCode: 'Password correct. Now the code from the phone',
		guessing: 'Guessing {code}',
		locked: 'Too many wrong codes, login blocked',
		yourTurn: 'Blocked for him, open for you',
		wrong: 'That code does not match',
		welcome: 'Welcome back, it really is you'
	}
};
