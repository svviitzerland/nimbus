import type { AuthText } from './types';

export const en: AuthText = {
	title: 'Sessions, cookies, and tokens',
	intro: [
		'Here is a funny thing about the web. Every request reaches the <b>nimbus.com</b> server like a total stranger. The server answers it, then forgets it ever happened.',
		'So how does the shop know it is still you on the next page? When you log in with your password, the server hands your browser a tiny note called a <b>cookie</b>. From then on the browser attaches that note to every request it sends to nimbus.com, all by itself.',
		'The classic way is a <b>session</b>. The cookie holds only a random number, and the server keeps a list saying which number belongs to whom. Like the ticket from a coat check, the ticket means nothing without the list behind the counter.',
		'The other way is a <b>token</b>, often a <b>JWT</b> (JSON Web Token). Here the note itself says who you are, and the server signs it with a secret only it knows. No list needed, the server just checks the signature, like a stamped wristband at a concert.',
		'[fyi] Logging in starts with your password, but a good server never stores the password itself. It keeps a scrambled fingerprint of it instead, the trick behind [[hashing|security/hashing]].',
		'[fyi] Same word, different world. In AI, a <b>token</b> means a small piece of a word that a language model reads, nothing to do with logins. See [[LLM tokens|ai/llm]].',
		'Try it yourself. Log in, open your orders, then delete the cookie and open them again. After that, switch to tokens and compare.'
	],
	reactions: {
		login:
			'You are in. The server made a new session, wrote the number in its list next to your name, and sent that number back as a cookie. Look at the cookie jar.',
		browse:
			'The browser quietly attached the cookie, the server found that number in its list, and knew it was you. That is why you stay logged in from page to page.',
		deleted:
			'Cookie gone. Your phone still shows the old page, but nothing proves who you are anymore. Now try opening your orders.',
		kicked:
			'Logged out! The request arrived with no cookie, so to the server you are a stranger again. This is exactly what happens when you clear your browser data.',
		stranger: 'No cookie, no entry. The server has never seen you, so it asks you to log in first.',
		token:
			'This time the cookie holds a token. Notice the server list stays empty, everything it needs is written inside the token and protected by its signature.',
		tokenBrowse:
			'The server read the token, checked the signature with its secret, and trusted it, all without looking anything up. That makes tokens handy when many servers share the work.',
		tokenKicked:
			'Same story with tokens. Without the token there is nothing to check, so you are logged out. The flip side is that anyone who steals a token can use it until it expires, so keep it secret.'
	},
	modeSession: 'Session',
	modeToken: 'Token (JWT)',
	login: 'Log in',
	browse: 'Open My orders',
	deleteCookie: 'Delete the cookie',
	page: {
		loginTitle: 'Log in to nimbus.com',
		email: 'nim@nimbus.com',
		loginHint: 'Log in to see your orders',
		hello: 'Hi Nim, your orders',
		orders: ['Nimbus Cap', 'Cloud Sticker'],
		kickedTitle: 'Who are you?',
		kickedHint: 'Please log in again'
	},
	jarLabel: 'Cookies on your phone',
	jarEmpty: 'Empty',
	tokenInside: 'Inside it says user nim, valid for 1 hour, plus the server signature',
	logLabel: 'Last request',
	logIdle: 'Nothing sent yet',
	noCookie: 'no cookie',
	serverLabel: 'nimbus.com server',
	sessionsLabel: 'Session list',
	sessionsEmpty: 'Nobody yet',
	sessionOwner: 'Nim',
	tokenServer: 'Keeps no list, only checks the signature with its secret key'
};
