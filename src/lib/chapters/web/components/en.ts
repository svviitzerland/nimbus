import type { ComponentsText } from './types';

export const en: ComponentsText = {
	title: 'Components',
	intro: [
		'Look closely at this shop page. The same little card shows up again and again, a picture, a name, a price. Only the details inside change, the shape stays the same.',
		'Frameworks let you write that card <b>once</b>, as a <b>component</b>. A component is a reusable piece of a page, like one LEGO brick you can click in anywhere. Here is the Card, still empty.',
		'To make every copy different, you hand it some data, called <b>props</b> (short for properties). Watch. A name and a price go in, a finished card comes out, four times, from the same Card.',
		'A whole page is built this way, components inside components. The header is one, every card is one, and even the buttons can be their own.',
		'Now the best part. Add an Add to cart button to the Card <b>once</b>, and every card on the page gets it at the same moment. This is the payoff of [[a framework|web/why-framework]].',
		'[fyi] Nimbus itself is made of components too. Nim, the speech bubble, and the Next button are each written once and reused in every lesson you open.',
		'[ingat] A component is a cookie cutter, props are the toppings. One cutter, many cookies, each one topped differently.',
		'Your turn, if you like. Take the button off the Card, or put it back, and watch all four cards follow.'
	],
	reactions: {
		plain:
			'Gone from the Card, gone from every card. You changed one cookie cutter, not four pages.',
		upgrade:
			'Back on the Card, back on all four. On a shop with a thousand products, that is one edit instead of a thousand.'
	},
	steps: [
		{
			title: 'The same shape',
			body: 'Shop pages repeat one <b>pattern</b>. A picture, a name, a price, over and over with different details.'
		},
		{
			title: 'A component',
			body: 'A reusable piece of a page, written <b>once</b>. In Svelte it lives in its own file, here <b>Card.svelte</b>.'
		},
		{
			title: 'Props',
			body: '<b>Props</b> are the details you hand in. Same Card, different props, so one shows a mug and the next a cap.'
		},
		{
			title: 'Pieces in pieces',
			body: 'A page is a tree of components. The header, each card, and each button can be its own piece.'
		},
		{
			title: 'Change once',
			body: 'Edit the component and <b>every copy</b> changes with it, so the whole shop stays consistent.'
		},
		{
			title: 'Nimbus too',
			tag: 'By the way',
			body: 'Nim, the speech bubble, and the Next button are components, written once and reused in every lesson.'
		},
		{
			title: 'Cookie cutter and toppings',
			tag: 'Make it stick',
			body: 'Component is the <b>cookie cutter</b>, props are the <b>toppings</b>.'
		}
	],
	recipeLabel: 'Card.svelte',
	propsLabel: 'props',
	pageLabel: 'nimbus.com/shop',
	headerTag: 'Header',
	cardTag: 'Card',
	products: [
		{ name: 'Nim mug', price: 12 },
		{ name: 'Nim cap', price: 15 },
		{ name: 'Cloud tee', price: 20 },
		{ name: 'Stickers', price: 3 }
	],
	money: '${n}',
	addToCart: 'Add to cart',
	removeButton: 'Take the button off Card',
	addButton: 'Put the button back on Card'
};
