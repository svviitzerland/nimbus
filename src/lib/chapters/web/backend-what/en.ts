import type { BackendWhatText } from './types';

export const en: BackendWhatText = {
	title: 'What is a backend',
	intro: [
		'When you shop on <b>nimbus.com</b>, everything you see and tap (the cap photo, the price, the big Buy button) lives on your phone. That visible part is called the <b>frontend</b>.',
		'But your phone cannot decide on its own that your order is real. So when you tap Buy, it packs the order into a little message and sends it far away.',
		'The message lands at the <b>backend</b>, a program running on a server. You never see it, a bit like the kitchen of a restaurant. You only see the plate that comes out.',
		'First the backend checks <b>who is asking</b>. Anyone on the internet can send a message, so it never trusts the phone blindly.',
		'Then it asks the <b>database</b>, the big notebook where every product, account, and order is kept. Is a cap still in stock? Only the backend may open that notebook.',
		'The order gets written down, and the backend emails you a receipt. All of that happens in less than a second.',
		'[ingat] Frontend is the dining room, backend is the kitchen. You see the plate, never the stove.',
		'[fyi] The phone and the backend talk through an [[API|foundations/api]], an agreed list of questions the frontend may ask. That is coming up right after this.',
		'Watch the order go round by itself. Curious who really decides? Log out and let it try again.'
	],
	reactions: {
		loggedOut:
			'Stopped right at the first drawer. Without a login the backend has no idea whose order this is, so it says no. Your phone can show a pretty button, but the backend decides.',
		loggedIn: 'Logged back in, and the order goes all the way through again.'
	},
	steps: [
		{
			title: 'Frontend',
			body: 'Everything <b>on your screen</b>. The pictures, buttons, and text your phone draws for you.'
		},
		{
			title: 'The request',
			body: 'Tapping Buy sends a small message over the internet, called a <b>request</b>. It says what you want, one Nimbus Cap.'
		},
		{
			title: 'Backend',
			body: 'A program on a <b>server</b>, a computer that is always on. It does the work nobody sees.'
		},
		{
			title: 'Who is asking',
			body: 'Before anything else the backend checks your <b>login</b>. No login, no order.'
		},
		{
			title: 'Database',
			body: 'Where the shop keeps its data for good. Your phone never opens it, it always <b>asks the backend</b>.'
		},
		{
			title: 'Saved and sent',
			body: 'The order is now <b>written down</b>, even if your battery dies. The receipt comes from the backend, not from your phone.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Frontend is the <b>dining room</b>, backend is the <b>kitchen</b>.'
		},
		{
			title: 'API',
			tag: 'Side note',
			body: 'The <b>menu</b> of questions the frontend is allowed to ask the backend.'
		},
		{
			title: 'Who decides',
			body: 'The button lives on your phone, but <b>the backend decides</b> whether the order is real.'
		}
	],
	frontLabel: 'Frontend',
	frontSub: 'what you see',
	backLabel: 'Backend',
	backSub: 'hidden on a server',
	roomFront: 'the dining room',
	roomBack: 'the kitchen',
	stations: { who: 'Who is it?', stock: 'In stock?', save: 'Save order', mail: 'Send receipt' },
	product: 'Nimbus Cap',
	price: 'Rp90.000',
	buy: 'Buy',
	phone: {
		idle: 'Ready to order',
		waiting: 'Processing',
		done: 'Order placed',
		rejected: 'Log in first'
	},
	dbLabel: 'Database',
	mailLabel: 'Email',
	apiLabel: 'API',
	logoutBtn: 'Log out and order',
	loginBtn: 'Log back in'
};
