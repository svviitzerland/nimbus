import type { SsoText } from './types';

export const en: SsoText = {
	title: 'SSO and OAuth',
	intro: [
		'Count your accounts for a second. Shopping, games, school, chat. Every one of them wants a password, so most people end up reusing the same one everywhere. When one site leaks, the rest fall like dominoes.',
		'<b>SSO</b> (single sign on) flips that around. One trusted account vouches for you in many places. At a school or an office you log in once in the morning, and email, chat, and files all open without asking again.',
		'Before this existed, some sites simply asked for your email password so they could look through your contacts for friends. That is like handing a stranger your house key so he can peek at your guest book.',
		'In 2007 a group of developers, Blaine Cook at Twitter among them, started building a better way called <b>OAuth</b>. The version used today, OAuth 2.0, became an internet standard in 2012.',
		'The idea is a valet key. Some cars come with a spare key that can drive the car but cannot open the boot. With OAuth, the site gets a <b>token</b> like that, limited to what you allowed, and never your password.',
		'[fyi] Same word, different world. "Sign in with Google" on a shop is SSO for anyone on the internet. Inside a company, SSO usually runs through the company\'s own identity system, the same idea as [[Identity and Access|networking/iam]].',
		'Try it. Sign in to nimbus.com with your Google account, and keep an eye on the address bar and on what gets shared.'
	],
	reactions: {
		redirect:
			"Look at the address bar. nimbus.com did not ask for your password at all, it sent you over to Google's own page.",
		google:
			'You typed your password on accounts.google.com, the real Google, so nimbus.com never sees it. Now Google asks you what nimbus.com may know about you.',
		consent:
			'Back on nimbus.com and signed in. What arrived is a token plus only what you allowed. Your Google password never left Google.',
		greedy:
			'Signed in, but you handed over more than a shop needs. Your contacts belong to your friends too. In 2014 a Facebook quiz app used permissions like this to gather data on up to 87 million people, which became the Cambridge Analytica scandal. Only allow what makes sense.',
		revoke:
			"Gone. You can remove a site's access any time from your Google account settings, and its token stops working. Your password does not even need to change."
	},
	signInTitle: 'Sign in to nimbus.com',
	googleBtn: 'Sign in with Google',
	orPassword: 'or make yet another password',
	googleTitle: 'Sign in',
	googleSub: 'to continue to nimbus.com',
	googleEmail: 'you@gmail.com',
	passwordField: 'password',
	nextBtn: 'Next',
	consentTitle: 'nimbus.com wants to',
	scopes: {
		name: 'See your name',
		email: 'See your email address',
		photo: 'See your profile photo',
		contacts: 'Read all your contacts',
		drive: 'Read your Drive files'
	},
	requiredTag: 'needed',
	allowBtn: 'Allow',
	returning: 'Heading back to nimbus.com',
	welcomeTitle: 'Signed in',
	welcomeSub: 'as you@gmail.com',
	gotTitle: 'What nimbus.com received',
	tokenChip: 'access token',
	passwordRow: 'Your Google password',
	neverTag: 'never',
	notSharedTag: 'kept private',
	revokeBtn: "Remove nimbus.com's access",
	revokedNote: 'Access removed, the token no longer works',
	hints: {
		start: 'Tap the Google button on nimbus.com',
		google: 'This page belongs to Google, not nimbus.com',
		consent: 'Switch off anything a shop does not need, then allow',
		done: 'Signed in without giving nimbus.com a password'
	}
};
