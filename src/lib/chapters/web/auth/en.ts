import type { AuthText } from './types';

export const en: AuthText = {
	title: 'Sessions, cookies, and tokens',
	intro: [
		'Here is a funny thing about the web. Every request reaches the <b>nimbus.com</b> server like a stranger. The server answers, then forgets it ever happened.',
		'So how does the shop know it is still you on the next page? You log in once, with your email and password.',
		'In return the server hands your browser a <b>cookie</b>, a tiny note the browser keeps. From then on the browser clips that note to every request it sends to nimbus.com, all by itself.',
		'The classic way is called a <b>session</b>. The cookie only holds a random number, and the server keeps a list of which number belongs to whom.',
		'On the next page the cookie rides along, the server finds the number on its list, and greets you by name. No new login needed.',
		'The other way uses a <b>token</b>, often a <b>JWT</b> (JSON Web Token). Here the note itself says who you are, and the server stamps it with a secret only it knows. No list, it just checks the stamp.',
		'[ingat] A session is a cloakroom ticket, just a number, and the coat list stays behind the counter. A token is a concert wristband, everything is printed on it and the stamp proves it is real.',
		'[fyi] Logging in starts with a password, but a good server never stores the real one. It keeps a scrambled fingerprint instead, the trick is in [[hashing|security/hashing]].',
		'[fyi] Same word, different world. In AI a <b>token</b> means a small piece of text a language model reads, nothing to do with logins. See [[tokens in LLMs|ai/llm]].',
		'Watch the cookie ride along with every page. Want to see why it matters? Delete it and watch the next request.'
	],
	reactions: {
		deleted:
			'Cookie gone. The next request arrives with nothing clipped to it, so to the server you are a stranger again and you land on the login page. That is exactly what clearing your browser data does.',
		login: 'Logged in again, a fresh cookie in your pocket, and the server knows you once more.'
	},
	steps: [
		{
			title: 'The server forgets',
			body: 'Each request stands <b>on its own</b>. Out of the box, the server keeps no memory of the last one.'
		},
		{
			title: 'Logging in',
			body: 'You prove who you are <b>once</b>, usually with an email and a password.'
		},
		{
			title: 'Cookie',
			body: 'A tiny note the server asks your <b>browser to keep</b>. The browser sends it back with every request to that site.'
		},
		{
			title: 'Session',
			body: 'The cookie holds only a <b>random number</b>. The server keeps the list that says whose number it is.'
		},
		{
			title: 'Remembered',
			body: 'Same cookie on every page. The server <b>looks up the number</b> and knows it is you.'
		},
		{
			title: 'Token (JWT)',
			body: 'The note <b>carries your name</b> and a stamp from the server. The server checks the stamp, no list needed.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Session is a <b>cloakroom ticket</b>, token is a <b>concert wristband</b>.'
		},
		{
			title: 'Passwords',
			tag: 'Side note',
			body: 'The server stores a <b>scrambled fingerprint</b> of your password, never the password itself.'
		},
		{
			title: 'Another token',
			tag: 'Side note',
			body: 'In AI, a token is <b>a piece of a word</b>. Same name, unrelated idea.'
		},
		{
			title: 'No cookie, no you',
			body: 'Without the cookie the request is a <b>stranger</b> again, and you have to log in.'
		}
	],
	serverLabel: 'nimbus.com server',
	page: {
		loginTitle: 'Log in',
		email: 'nim@nimbus.com',
		loginBtn: 'Log in',
		hello: 'Hi Nim',
		ordersLabel: 'Your orders',
		orders: ['Nimbus Cap', 'Cloud Sticker'],
		whoTitle: 'Who are you?',
		whoHint: 'Please log in'
	},
	sessionNumber: '#4821',
	wristband: 'Nim, 1 hour',
	noCookie: 'no cookie',
	listLabel: 'Session list',
	listRows: [
		{ number: '#1377', name: 'Ana' },
		{ number: '#4821', name: 'Nim' },
		{ number: '#9050', name: 'Budi' }
	],
	tokenLabel: 'No list',
	tokenNote: 'checks the stamp',
	hashLabel: 'Saved passwords',
	hashUser: 'nim',
	hashValue: '9f2c7ab1',
	deleteBtn: 'Delete the cookie',
	againBtn: 'Log in again'
};
