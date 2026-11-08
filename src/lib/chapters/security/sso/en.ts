import type { SsoText } from './types';

export const en: SsoText = {
	title: 'SSO and OAuth',
	intro: [
		'<b>SSO</b> lets one identity service help you sign in to several applications. Each application does not need to collect that identity password.',
		'Watch the address change in the lab. Nimbus asks the identity service to handle sign in, then receives verifiable proof. Every account here is simulated.',
		'<b>OAuth</b> concerns delegated access. An access token can grant permission to read a profile without handing the application your password.',
		'<b>OpenID Connect</b> adds an identity layer on top of OAuth 2.0. It is one way an application learns who signed in. OAuth alone is not a login protocol.',
		'Inspect the requested permissions. Basic profile data and access to every file are different levels of access. Grant what the application needs.',
		'[ingat] <b>Identity proves who; permission limits what.</b> Check the login page address and consent screen.',
		'Try the lab sign in, then cancel or revoke access. Observe what data Nimbus receives at each step.'
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
