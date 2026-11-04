import type { CssText } from './types';

export const en: CssText = {
	title: 'What is CSS',
	intro: [
		'Remember the nimbus.com page you built with [[HTML|web/html]]? A heading, a paragraph, a button, and Nim. It works, but it looks plain, black letters on white, like a school form from 1995.',
		'That is because HTML only says what each part is. How it looks is a separate job, done by <b>CSS</b> (short for Cascading Style Sheets). If HTML is the skeleton, CSS is the clothes. Watch, Nim starts a rule for <b>body</b>, the whole page.',
		'Inside the curly brackets go small instructions, each one a <b>property</b> and a <b>value</b>. Here the property is background and the value is a soft blue. One line, and the whole page changes.',
		'Now a rule that picks only <b>h1</b>, the heading. Its color turns tomato red, and nothing else on the page moves. The part before the bracket, called the <b>selector</b>, decides who gets the change.',
		'Back in body, one more line swaps the font. Every piece of text switches at once, because tags inside body borrow their font from it. That borrowing is called <b>inheritance</b>.',
		'The button gets its own rule, a color, no border, round corners, and some padding (space inside the box). Every button you have ever tapped in an app was shaped with lines like these.',
		'[fyi] The word cascading means rules can pile up. Nim adds a second h1 rule at the bottom, and the heading turns blue. When two rules point at the same thing in the same way, the one written later wins.',
		'[ingat] Read every rule like a little sentence. The selector is <b>who</b>, the property is <b>what</b>, the value is <b>how</b>. So h1, color, tomato means the heading, its color, tomato red.',
		'Same HTML the whole time, only the clothes changed. If you like, tap a color under the code and watch the heading follow. Next, the button learns to do something with [[JavaScript|web/js]].'
	],
	reactions: {
		color:
			'See how only the last h1 rule changed, and the heading followed right away? That is the cascade at work, the later rule still wins.'
	},
	steps: [
		{
			tag: 'index.html',
			title: 'Just HTML',
			body: 'The page has structure but no style yet, so the browser falls back to its plain default look.'
		},
		{
			title: 'A rule begins',
			body: '<b>body</b> picks the tag that wraps everything you see. The curly brackets will hold what should change.'
		},
		{
			title: 'Property and value',
			body: '<b>background</b> is the property and the soft blue is the value. Every line ends with a semicolon.'
		},
		{
			title: 'The selector',
			body: 'A rule only touches what its selector picks. <b>h1</b> means the main heading, nothing more.'
		},
		{
			title: 'Inheritance',
			body: 'Text styles flow down from a parent to everything inside it, so one font line on body covers the whole page.'
		},
		{
			title: 'Shaping a box',
			body: 'Every element is a box. <b>padding</b> is the space inside it and <b>border-radius</b> rounds its corners.'
		},
		{
			title: 'The cascade',
			body: 'Two h1 rules disagree about the color. Both point at the heading the same way, so the one further down wins.'
		},
		{
			tag: 'Make it stick',
			title: 'Who, what, how',
			body: '<b>h1</b> is who, <b>color</b> is what, <b>tomato</b> is how. Every CSS line you will ever read fits this pattern.'
		},
		{
			title: 'Your stylesheet',
			body: 'Tap a color to rewrite the last h1 rule. The page changes as soon as the line is written.'
		}
	],
	comment: 'styles for nimbus.com',
	cssLabel: 'style.css',
	previewLabel: 'nimbus.com',
	page: {
		heading: 'Welcome to Nimbus',
		paragraph: 'Your first website in the cloud.',
		button: 'Start now',
		alt: 'Nim the cloud'
	},
	tryLabel: 'Pick a heading color'
};
