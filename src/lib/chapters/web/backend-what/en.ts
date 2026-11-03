import type { BackendWhatText } from './types';

export const en: BackendWhatText = {
	title: 'What is a backend',
	intro: [
		'When you shop on <b>nimbus.com</b>, everything you see and tap (the product photos, the cart, the big Buy button) lives on your phone. That visible part is called the <b>frontend</b>.',
		'But your phone cannot decide on its own that your order is real. Someone has to check who you are, whether the cap is still in stock, write the order down, and send you a receipt.',
		'That someone is the <b>backend</b>, a program running on a server far away. You never see it, a bit like the kitchen of a restaurant. You only see the waiter and the plate that comes out.',
		'The backend is also the only one allowed to touch the <b>database</b>, the big notebook where every product, account, and order is kept. Your phone never opens it directly, it always asks the backend.',
		'[fyi] The frontend and the backend talk through an [[API|foundations/api]], a set of agreed questions the frontend may ask. That is coming up right after this.',
		'Let us follow one order. Put a Nimbus Cap in the cart, place the order, then walk it through the backend one step at a time. Try it logged out too and see who stops you.'
	],
	reactions: {
		login:
			'First stop, the login check. The backend looks at who is asking. Anyone can send a request, so it never trusts the phone blindly.',
		rejected:
			'Stopped right at the door. Without a login the backend has no idea whose order this is, so it refuses. Your phone can show a pretty button, but only the backend decides.',
		stock:
			'Now it asks the database if there is still a cap left. The phone might show an old number, the database knows the real one.',
		save: 'The order gets written into the database. From this moment it really exists, even if you close the app or your battery dies.',
		email:
			'Last, the backend sends a receipt email. Your phone never sends that, the backend does, because only the backend can be trusted with it.',
		done: 'Order confirmed! Four jobs happened on a server you never saw, in well under a second in real life. That hidden worker is the backend.'
	},
	frontLabel: 'Frontend (your phone)',
	backLabel: 'Backend',
	backSub: 'a program on the nimbus.com server',
	product: 'Nimbus Cap',
	price: 'Rp90.000',
	loggedIn: 'Logged in as Nim',
	loggedOut: 'Not logged in',
	placeOrder: 'Place order',
	nextStep: 'Next step in the backend',
	again: 'Order again',
	steps: {
		login: { title: 'Check the login', detail: 'Who is asking?' },
		stock: { title: 'Check the stock', detail: 'Any caps left?' },
		save: { title: 'Save the order', detail: 'Write it in the database' },
		email: { title: 'Send a receipt', detail: 'Email to the buyer' }
	},
	loginFail: 'Nobody logged in, order refused',
	dbLabel: 'Database',
	mailLabel: 'Email',
	phone: {
		idle: 'Ready to check out',
		waiting: 'Processing your order',
		done: 'Order confirmed',
		rejected: 'Please log in first',
		inbox: 'Receipt in your inbox'
	}
};
