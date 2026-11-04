import type { WhyFrameworkText } from './types';

export const en: WhyFrameworkText = {
	title: 'What is a framework',
	intro: [
		'nimbus.com started small, one home page written by hand in [[HTML|web/html]]. Then it grew. A shop page, a mug page, a cart, a checkout, a receipt. Each one is its own file, and every one of them shows the mug price.',
		'Now the Nim mug goes on sale, from 12 down to 9. Someone has to open every file, find the price, and change it, one by one. Fine for six pages, painful for six hundred.',
		'And people get tired. Miss just one, and the cart says 12 while the checkout says 9. The shopper is confused, and you have a <b>bug</b>, a mistake in the program.',
		'A <b>framework</b> is a ready made structure for building apps, so you stop repeating yourself. The price lives in <b>one place</b>, every page reads it from there, and when it changes, every page follows on its own.',
		'For pages in the browser the big names are <b>React</b> (from Facebook), <b>Vue</b>, <b>Svelte</b>, and <b>Angular</b> (from Google). They all run on [[JavaScript|web/js]] and solve this same problem, each in its own style.',
		'[fyi] The page you are on right now is built with Svelte. Every lesson reuses the same Nim, the same speech bubble, and the same buttons, which is exactly the trick you will see in [[components|web/components]].',
		'[ingat] One fact, one place. It is like an announcement in the class group chat. Send it once and everyone knows, no need to message thirty friends one by one.',
		'Your turn, if you like. Change the price in that one place and watch every page follow.'
	],
	reactions: {
		price:
			'One change, and all six pages followed at once. Nobody opened a single file, and no page can be forgotten.'
	},
	steps: [
		{
			title: 'A growing site',
			body: 'Every page is its own file, and the same facts (like a price) get <b>copied</b> into many of them.'
		},
		{
			title: 'By hand',
			body: 'To change a copied fact you must <b>visit every copy</b>. It is slow, and it gets slower as the site grows.'
		},
		{
			title: 'One missed copy',
			body: 'Two pages now disagree. A mistake like this in a program is called a <b>bug</b>.'
		},
		{
			title: 'A framework',
			body: 'The fact lives in <b>one place</b>. Pages do not copy it, they <b>read</b> it, so a change reaches all of them at once.'
		},
		{
			title: 'The big names',
			body: '<b>React</b>, <b>Vue</b>, <b>Svelte</b>, and <b>Angular</b>. Different styles, same idea, all written in JavaScript.'
		},
		{
			title: 'You are inside one',
			tag: 'By the way',
			body: 'Nimbus is built with <b>Svelte</b>. Nim and the speech bubble are written once and reused in every lesson.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: '<b>One fact, one place.</b> Like a group chat announcement, send once and everyone knows.'
		}
	],
	pages: ['Home', 'Shop', 'Mug', 'Cart', 'Checkout', 'Receipt'],
	money: '${n}',
	storeLabel: 'price',
	bugNote: 'Cart $12, checkout $9',
	lower: 'Lower the price',
	raise: 'Raise the price'
};
