import type { WhyFrameworkText } from './types';

export const en: WhyFrameworkText = {
	title: 'What is a framework',
	intro: [
		'nimbus.com started small, a home page written by hand in [[HTML|web/html]]. Then it grew. A shop page, a cart, a checkout, search results, a receipt email. Each one is its own file.',
		'Now the Nim mug goes on sale. Its price lives in ten different files, and someone has to find and change every single one. Miss one, and the cart says one price while the checkout says another.',
		'A <b>framework</b> is a ready made structure for building apps, so you stop repeating yourself. You keep each piece of data in <b>one place</b>, and every page that uses it updates on its own when it changes.',
		'For pages in the browser, the big names are <b>React</b> (made at Facebook), <b>Vue</b>, <b>Svelte</b>, and <b>Angular</b> (made at Google). They all run on [[JavaScript|web/js]], and they all solve this same problem in slightly different styles.',
		'[fyi] The page you are on right now is built with Svelte. Every lesson reuses the same Nim, the same speech bubble, and the same buttons, which is exactly the trick you will see in [[components|web/components]].',
		'[ingat] Keep shared data in one source and reuse it in the components that need it.',
		'Your turn. The mug drops from 12 to 9. First update all ten places by hand and publish, then try the framework way and feel the difference.'
	],
	reactions: {
		missed:
			'Uh oh, the site went live with mixed prices. A buyer sees one price in the cart and another at checkout. That is exactly how bugs sneak in when the same data is copied around.',
		handDone:
			'All ten updated. It worked, but imagine a real shop with hundreds of pages and dozens of prices. Now flip to the framework tab.',
		framework:
			'One change, and all ten places followed instantly. The price lives in one spot and every page reads from it. That is the heart of what a framework gives you.'
	},
	modes: { hand: 'By hand', framework: 'With a framework' },
	handHint: 'Tap each file to change the mug price to 9, then publish',
	frameworkHint: 'Change the price once and watch every page',
	places: [
		'home.html',
		'shop.html',
		'mug.html',
		'cart.html',
		'checkout.html',
		'search.html',
		'deals.html',
		'wishlist.html',
		'receipt.html',
		'email.html'
	],
	money: '${n}',
	publish: 'Publish',
	publishedOk: 'Published with matching prices on every page',
	publishedMissed: 'Live, but {n} pages still show the old price',
	edits: '{n} edits',
	priceLabel: 'price',
	cheaper: 'Lower the price',
	pricier: 'Raise the price',
	reset: 'Start over'
};
