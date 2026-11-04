import type { UiUxText } from './types';

export const en: UiUxText = {
	title: 'UI and UX',
	intro: [
		'Think of your favourite app. Part of why you like it is how it <b>looks</b>, and part of it is how <b>easy</b> it is to get things done. Those are two different jobs, and each one has its own name.',
		'<b>UI</b> stands for user interface. It is everything you see and touch on the screen, the colours, the letters, the buttons, the space between things.',
		'<b>UX</b> stands for user experience. It is how it feels to actually use the thing. Watch someone buy a mug. Find the button, tap it, done, nothing to think about. That smooth feeling is good UX.',
		'Now the same shop, made carelessly. Two buttons that look exactly alike, a label that says nothing (Proceed to what?), and a fee that only shows up at the very end. The paint is fine, the experience is not.',
		'Here it is made with care. One clear main button that says exactly what happens, and the full price shown from the start. Same colours, same letters, yet it feels completely different.',
		'[fyi] UX is not only about screens. Ever pulled a door that should have been pushed? People call those Norman doors, after Don Norman, the designer who made the words user experience popular in the 1990s.',
		'[ingat] UI is the shirt, UX is how comfy it is to wear. A shirt can look great and still itch all day. Good products need both, and next you will see how a design becomes real [[CSS|web/css]] in [[design to code|web/design-to-code]].',
		'Your turn, if you like. Flip between the careless shop and the careful one, and spot what changed.'
	],
	reactions: {
		messy:
			'Same look, but squint at it. Which button buys the mug? And where did that extra fee come from? That confusion is a UX problem, not a UI one.',
		clear:
			'Back to the careful shop. One button, one honest price, nothing to guess. Your thumb knows where to go.'
	},
	steps: [
		{
			title: 'Two jobs',
			body: 'Every app has a <b>look</b> and a <b>feel</b>. They are made by different decisions, so they get different names.'
		},
		{
			title: 'UI, the look',
			body: '<b>User interface</b> means what you see and touch. Colours, fonts, buttons, and spacing are all UI.'
		},
		{
			title: 'UX, the feel',
			body: '<b>User experience</b> means how using it feels. Can you find things, does it do what you expect, do you finish without frowning?'
		},
		{
			title: 'Careless UX',
			body: 'Look alike buttons, vague words, and <b>surprise costs</b> make people hesitate, tap the wrong thing, or give up.'
		},
		{
			title: 'Careful UX',
			body: 'One <b>clear main action</b>, words that say what happens, and no surprises. People finish fast and feel good about it.'
		},
		{
			title: 'Not just screens',
			tag: 'By the way',
			body: 'A door whose handle says pull while the sign says push is bad UX too. Good design tells you what to do without a sign.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'UI is the <b>shirt</b>, UX is how <b>comfy</b> it is to wear. You need both.'
		}
	],
	site: 'nimbus.com',
	product: 'Nim mug',
	price: '$12',
	buy: 'Buy now',
	paid: 'Mug on its way',
	uiColor: 'Colour',
	uiFont: 'Letters',
	uiButton: 'Button',
	messy: {
		cancel: 'Cancel',
		next: 'Proceed',
		fee: '+ $4 handling fee',
		total: 'Total $16',
		flags: ['Which one buys?', 'Proceed to what?', 'Surprise fee']
	},
	clear: {
		pay: 'Pay $12',
		free: 'Free shipping',
		total: 'Total $12',
		flags: ['One main action', 'Says what happens', 'Price up front']
	},
	door: { sign: 'PUSH', caption: 'The handle says pull, the sign says push' },
	lookTag: 'UI, the look',
	feelTag: 'UX, the feel',
	showMessy: 'Show the careless shop',
	showClear: 'Show the careful shop'
};
