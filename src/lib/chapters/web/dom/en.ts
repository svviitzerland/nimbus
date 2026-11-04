import type { DomText } from './types';

export const en: DomText = {
	title: 'The DOM and events',
	intro: [
		'When the browser reads your HTML, it does not keep it as text. It turns every tag into an object and hangs them together in a tree. Watch it grow. This tree is called the <b>DOM</b> (Document Object Model).',
		'Picture a family tree. <b>html</b> sits at the top, <b>body</b> is its child, and inside body live header, main, and footer, each with children of their own. Every tag has exactly one parent.',
		'The page you see and the tree are the same thing, just drawn two ways. Every box on the page is a node in the tree, and the browser keeps them in sync all the time.',
		'Here is the twist. [[JavaScript|web/js]] never touches your HTML file. It changes this living tree. Watch it hang a new <b>li</b> on the cart list, and the page shows a new line instantly.',
		'Things that happen on a page are called <b>events</b>. A tap is a click event, typing is an input event. When you tap the button, the click starts right there, at the button.',
		'Then it travels. The click climbs from the button to its parent, then the parent of that, all the way up to html. That trip is called <b>bubbling</b>.',
		'So a listener does not have to sit on the button. Nim put one on <b>main</b>, higher up. Every click that bubbles out of main passes it, so main hears the button and adds to the cart.',
		'[fyi] Same word, different world. A [[webhook|foundations/apiWebhook]] is also about events, but between servers on the internet. A DOM event never leaves the one page open in your browser.',
		'[ingat] Think of soda bubbles. They start at the bottom where you tapped and float to the top. A listener only hears the click if it sits somewhere on the way up.',
		'Now tap any part of the page and watch its click float up the tree. Taps inside main reach the listener, taps in the header or footer float right past it.'
	],
	reactions: {
		bubble:
			'There it goes, from the part you tapped up to <b>html</b>. Any listener on that path gets a chance to react, the rest never hear a thing.'
	},
	steps: [
		{
			tag: 'DOM',
			title: 'From text to a tree',
			body: 'The browser reads the HTML top to bottom and turns every tag into a <b>node</b>, an object it can work with.'
		},
		{
			title: 'Parents and children',
			body: 'Each node has exactly one parent. <b>html</b> is the root at the top, and everything else hangs below it.'
		},
		{
			title: 'Two drawings, one thing',
			body: 'The highlighted box on the page and the highlighted node in the tree are the very same element.'
		},
		{
			title: 'JavaScript edits the tree',
			body: 'The code adds an <b>li</b> node to the list. The browser sees the tree change and repaints the page right away.'
		},
		{
			title: 'An event',
			body: 'A tap is a <b>click event</b>. It begins at the exact node you touched, called the target.'
		},
		{
			title: 'Bubbling',
			body: 'Then the event visits the parent, and the parent of that, until it reaches <b>html</b> at the top.'
		},
		{
			title: 'Listening higher up',
			body: 'A listener on <b>main</b> hears every click that bubbles out of it, so it can react to the button too.'
		},
		{
			title: 'Only inside this page',
			body: 'DOM events stay in your browser tab. Messages between servers are a different kind of event.'
		},
		{
			tag: 'Remember it',
			title: 'Bubbles float up',
			body: 'Tap low, the event floats up. A listener only hears it when it sits on the way up.'
		},
		{
			title: 'Tap anything',
			body: 'Tap a part of the page. Its click climbs the tree, and main adds to the cart when the click passes it.'
		}
	],
	pageLabel: 'nimbus.com',
	treeLabel: 'The DOM tree',
	page: {
		heading: 'nimbus.com',
		product: 'Nim plush',
		button: 'Add to cart',
		help: 'Help',
		added: 'Nim plush added'
	},
	listening: 'listening'
};
