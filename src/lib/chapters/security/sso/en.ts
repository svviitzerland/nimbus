import type { SsoText } from './types';

export const en: SsoText = {
	title: 'SSO and OAuth',
	intro: [
		'Count your accounts for a second. Shopping, games, school, chat. Every one of them wants a password, so most people end up reusing the same one everywhere. When one site leaks, the rest fall like dominoes.',
		'<b>SSO</b> (single sign on) flips that around. One trusted account vouches for you in many places. It is the <b>Sign in with Google</b> button you have seen on so many sites.',
		'Before this existed, some sites simply asked for your email password so they could look through your contacts for friends. That is like handing a stranger your house key so he can peek at your guest book.',
		"In 2007 a group of developers, Blaine Cook at Twitter among them, started building a better way called <b>OAuth</b>. Watch it play. You tap the Google button, and nimbus.com sends your browser over to Google's own page. Keep an eye on the address bar.",
		'You type your password on accounts.google.com, the real Google. nimbus.com never sees it, not even for a second.',
		'Then Google asks you what nimbus.com may know, like your name, email, and photo. Read this screen before you tap. In 2014 a Facebook quiz app asked for far too much and ended up with data on up to 87 million people, which became the Cambridge Analytica scandal.',
		'You tap allow, and Google hands nimbus.com a <b>token</b>. Think of a valet key, the spare car key that can drive the car but cannot open the boot. The token only does what you allowed, and it is never your password. OAuth 2.0, the version used today, became an internet standard in 2012.',
		'[ingat] <b>Your password only goes home.</b> A Google password is typed on google.com and nowhere else. If a shop page asks for it, close the tab.',
		"[fyi] Same word, different world. Sign in with Google on a shop is SSO for anyone on the internet. At a school or an office, SSO usually runs through the organisation's own identity system. You log in once in the morning and email, chat, and files all open, the same idea as [[Identity and Access|networking/iam]].",
		'One more superpower. You can take the token back any time from your Google account, and nimbus.com loses access right away. Try the button if you like, your password does not even need to change.'
	],
	reactions: {
		revoke:
			"Gone. nimbus.com's token stopped working the moment you removed it, so the shop cannot see anything any more. Your Google password never changed, and it never needed to."
	},
	steps: [
		{
			tag: 'The problem',
			title: 'Password dominoes',
			body: 'One password reused on many sites. When the weakest site leaks, <b>every</b> account with that password is open.'
		},
		{
			tag: 'The idea',
			title: 'Single sign on',
			body: 'One trusted account (like Google) <b>vouches</b> for you, so other sites do not need a password of their own.'
		},
		{
			tag: 'The old way',
			title: 'Handing over the key',
			body: 'Some sites once asked for your <b>email password</b>. With it they could read everything, not only your contacts.'
		},
		{
			tag: 'Step 1',
			title: 'Sent to Google',
			body: 'nimbus.com does not ask for a password. It <b>sends your browser</b> to accounts.google.com.'
		},
		{
			tag: 'Step 2',
			title: 'Log in at Google',
			body: 'The password goes to Google <b>only</b>. nimbus.com is not even on the page.'
		},
		{
			tag: 'Step 3',
			title: 'Consent',
			body: 'Google lists what nimbus.com wants. Allow only what a shop <b>really needs</b>.'
		},
		{
			tag: 'Step 4',
			title: 'The token',
			body: 'nimbus.com gets a <b>token</b>, a limited pass, plus the details you allowed. Never the password.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Passwords go home',
			body: 'A Google password belongs on <b>google.com</b>. Check the address bar before you type it.'
		},
		{
			tag: 'At work',
			title: 'One login, every app',
			body: 'Schools and offices use the same idea. One morning login opens <b>email, chat, and files</b>.'
		},
		{
			tag: 'Optional',
			title: 'Take it back',
			body: 'Remove the access and the token stops working. Your password stays exactly the same.'
		}
	],
	sites: ['shop', 'game', 'school', 'chat', 'email'],
	signInTitle: 'Sign in to nimbus.com',
	googleBtn: 'Sign in with Google',
	orPassword: 'or make yet another password',
	emailField: 'email',
	passwordField: 'new password',
	badTitle: 'Find your friends',
	badField: 'Your email password',
	badSub: 'We promise to only look at contacts',
	googleTitle: 'Sign in',
	googleSub: 'to continue to nimbus.com',
	googleEmail: 'you@gmail.com',
	nextBtn: 'Next',
	consentTitle: 'nimbus.com wants to',
	scopes: {
		name: 'See your name',
		email: 'See your email address',
		photo: 'See your profile photo'
	},
	allowBtn: 'Allow',
	welcomeTitle: 'Signed in',
	welcomeSub: 'as you@gmail.com',
	gotTitle: 'What nimbus.com received',
	tokenChip: 'access token',
	passwordRow: 'Your Google password',
	neverTag: 'never',
	apps: ['Email', 'Chat', 'Files'],
	revokeBtn: "Remove nimbus.com's access",
	revokedTitle: 'Signed out',
	revokedNote: 'The token no longer works'
};
