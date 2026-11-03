import type { ComponentsText } from './types';

export const en: ComponentsText = {
	title: 'Components',
	intro: [
		'Look closely at any shop page. The same little card shows up again and again, a picture, a name, a price. Only the details inside change, the shape stays the same.',
		'Frameworks let you write that card <b>once</b>, as a <b>component</b>. A component is a reusable piece of a page, like a LEGO brick. A button, a card, a menu, a whole header, each can be its own component.',
		'To make every copy different, you hand it some data, called <b>props</b> (short for properties). Same card, different props, so one shows a mug and the next one a cap.',
		'[fyi] This is the payoff of [[a framework|web/why-framework]]. Nimbus itself is made of components too. Nim, the speech bubble, and the Next button are written once and reused in every lesson.',
		'Here is a Card component and the nimbus.com product list. Fill the shop by reusing the same Card with each product, then change the Card once and see what happens.'
	],
	reactions: {
		first:
			'There is your first card. The component is the recipe, and the props (name and price) are what makes this copy a mug.',
		all: 'Four cards from one recipe. You never wrote the card four times, you just fed it different data. Now try changing the recipe itself.',
		upgrade:
			'One change to the Card, and every product got a button at once. On a real site with hundreds of products, that saves hours and keeps every card consistent.'
	},
	recipeLabel: 'Card.svelte',
	dataLabel: 'Products',
	previewLabel: 'nimbus.com/shop',
	products: [
		{ name: 'Nim mug', price: 12 },
		{ name: 'Nim cap', price: 15 },
		{ name: 'Cloud tee', price: 20 },
		{ name: 'Sticker pack', price: 3 }
	],
	money: '${n}',
	use: 'Use Card',
	used: 'On the page',
	empty: 'Nothing for sale yet',
	upgrade: 'Add a button to Card',
	addToCart: 'Add to cart',
	upgradeHint: 'Place all four cards first'
};
