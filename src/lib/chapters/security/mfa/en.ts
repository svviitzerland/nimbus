import type { MfaText } from './types';

export const en: MfaText = {
	title: 'What is MFA',
	intro: [
		'Imagine someone already knows your nimbus.com password. Maybe it [[leaked from a careless shop|security/hashing]], maybe you typed it into a fake page. Is it game over?',
		'With only a password on the door, sadly yes. Watch. He types it in, the site checks it, and as far as nimbus.com can tell, he is you.',
		'Unless there is a second lock. <b>MFA</b> (multi factor authentication) asks for a second proof of a different kind. Something you <b>know</b> (a password), something you <b>have</b> (your phone or a small key), or something you <b>are</b> (a fingerprint or your face).',
		'You already use it. At an ATM the card is something you have and the PIN is something you know. A thief holding only one of them walks away with no money. That is MFA from long before the internet.',
		'Online, the second proof is usually a six digit code from an <b>authenticator app</b> on your phone. The code changes every 30 seconds, so an old one is useless.',
		'Now the attacker tries again with MFA on. The password is right, but the site wants the code too. The code lives on your phone, and your phone is in your pocket. Guessing six digits is one chance in a million, so he is stuck.',
		'[ingat] <b>Something you know plus something you have.</b> A password alone is a key anyone can copy. Add your phone, and a thief needs your pocket too.',
		'It works. In 2018 Google shared that since early 2017, when it gave physical security keys to its more than 85 thousand employees, not one of their work accounts had been taken over by phishing.',
		'[fyi] MFA is not magic though. In 2022 an attacker who had the password of an Uber contractor kept sending login approval requests to his phone, then messaged him pretending to be IT support, until he tapped approve. Never approve a login you did not start yourself.',
		'Your turn, if you like. This time you are the one logging in. Look at the phone and type the six digits it shows right now.'
	],
	reactions: {
		you: 'Welcome back. You had both, the password in your head and the phone in your hand. That is all MFA asks of you, and it stops most stolen password attacks cold.',
		wrongCode:
			'Not that one. Look at the phone and type the six digits it shows right now. If the ring is almost empty, wait for the fresh code.'
	},
	steps: [
		{
			tag: 'The problem',
			title: 'A stolen password',
			body: 'Passwords leak, get guessed, or get typed into fake pages. Sooner or later, someone else may <b>know</b> yours.'
		},
		{
			tag: 'MFA off',
			title: 'One lock only',
			body: 'The site only checks the password. Whoever types it <b>is you</b>, as far as the site can tell.'
		},
		{
			tag: 'The idea',
			title: 'Three kinds of proof',
			body: 'Something you <b>know</b>, something you <b>have</b>, something you <b>are</b>. MFA asks for two of different kinds.'
		},
		{
			tag: 'Everyday',
			title: 'The ATM',
			body: 'The <b>card</b> is something you have, the <b>PIN</b> is something you know. One alone gets a thief nothing.'
		},
		{
			tag: 'Have',
			title: 'Authenticator app',
			body: 'A six digit code made on your phone. It changes every <b>30 seconds</b> and is never sent anywhere.'
		},
		{
			tag: 'MFA on',
			title: 'Stuck at the second lock',
			body: 'Right password, no code. A few wrong guesses and the site <b>blocks</b> the login.'
		},
		{
			tag: 'Make it stick',
			title: 'Know plus have',
			body: 'Something in your <b>head</b> plus something in your <b>hand</b>. A thief rarely has both.'
		},
		{
			tag: 'Google, 2018',
			title: 'Security keys',
			body: 'A small USB key you tap to log in. More than 85 thousand employees, zero accounts lost to phishing.'
		},
		{
			tag: 'Uber, 2022',
			title: 'Approval spam',
			body: 'Request after request until someone taps yes out of tiredness. <b>Deny</b> any login you did not start.'
		},
		{
			tag: 'Optional',
			title: 'Log in yourself',
			body: 'Type the code from the phone into the login box above. Both locks, one after the other.'
		}
	],
	attackerLabel: 'Attacker, far away',
	youLabel: 'You',
	phoneLabel: 'Your phone',
	stolenChip: 'has your password',
	appName: 'Authenticator',
	appAccount: 'nimbus.com',
	mfaOffChip: 'MFA off',
	mfaOnChip: 'MFA on',
	loginTitle: 'nimbus.com login',
	emailValue: 'you@nimbus.com',
	codeField: 'code',
	loginBtn: 'Log in',
	factors: {
		know: { name: 'know', ex: 'password' },
		have: { name: 'have', ex: 'phone' },
		are: { name: 'are', ex: 'fingerprint' }
	},
	atm: { know: 'PIN', have: 'ATM card' },
	keyLabel: 'security key',
	approvePrompt: 'Approve login?',
	approveYes: 'Approve',
	approveNo: 'Deny',
	status: {
		idle: 'Password typed in',
		checking: 'Checking the password',
		taken: 'Logged in. The account is his now',
		askCode: 'Password correct. Now the code',
		guessing: 'Guessing {code}',
		locked: 'Too many wrong codes, blocked',
		push: 'Sending login requests to your phone',
		yourTurn: 'Type the code from your phone',
		wrong: 'That code does not match',
		welcome: 'Welcome back, it really is you'
	},
	codeHint: 'Code from your phone',
	submitBtn: 'Log in'
};
