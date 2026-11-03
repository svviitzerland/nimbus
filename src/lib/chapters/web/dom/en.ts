import type { DomText } from './types';

export const en: DomText = {
	title: 'The DOM and events',
	intro: [
		'When the browser reads your HTML, it does not keep it as text. It turns every tag into an object and hangs them all together in a tree, called the <b>DOM</b> (Document Object Model).',
		'Picture a family tree. <b>html</b> sits at the top, <b>body</b> is its child, and inside body live header, main, and footer, each with children of their own. Every tag has exactly one parent.',
		'Here is the twist. [[JavaScript|web/js]] never touches your HTML file. It changes this living tree, adding a branch, removing one, or swapping the words on a leaf, and the browser repaints the page to match right away.',
		'Things that happen on the page are called <b>events</b>. A tap is a click event, typing is an input event. When you tap a button, the event starts at that button, then travels up through every parent to the very top. That trip is called <b>bubbling</b>.',
		'So a listener does not have to sit on the button itself. A listener on a parent also hears every tap that bubbles up from inside it. But a listener on a branch the event never visits hears nothing at all.',
		'[fyi] Same word, different world. A [[webhook|foundations/apiWebhook]] is also about events, but between servers on the internet. A DOM event never leaves the one page open in your browser.',
		'Your turn! First tap things on nimbus.com and find them in the tree. Then tap the button and watch the click bubble up. Finally, hang a listener on a branch and make the tree grow.'
	],
	reactions: {
		found:
			'Every piece you tap is a node in the tree, and you can follow its family line all the way up to <b>html</b>. The page and the tree are the same thing, just drawn two ways.',
		bubble:
			'Did you see it climb? The click started at the thing you tapped, then visited every parent on the way up to <b>document</b>. Any listener on that path gets a chance to react.',
		miss: 'Nothing happened. The click bubbled up from what you tapped, but it never passed through that branch, so the listener there heard nothing. Try a node on the path to the top.',
		grow: 'The tree grew a new branch! The listener heard the click, and JavaScript added an <b>li</b> to the cart list. The browser noticed the tree changed and painted the new line instantly.',
		anywhere:
			'[fyi] It reacted even though you did not tap the button! Your listener sits on a big branch, so every click bubbling up from inside it counts. Real code checks which element was tapped first, using <b>event.target</b>.'
	},
	steps: { find: 'Find', bubble: 'Bubble', listen: 'Listen' },
	prompts: {
		find: 'Tap two different things on the page',
		bubble: 'Now tap anything on the page and watch the click climb',
		listen: 'Tap a node in the tree to put the listener there, then tap Add to cart'
	},
	pageLabel: 'nimbus.com',
	treeLabel: 'The DOM tree',
	page: {
		heading: 'nimbus.com',
		product: 'Nim plush',
		button: 'Add to cart',
		help: 'Help',
		added: 'Nim plush added'
	},
	trailLabel: 'The click visited',
	listening: 'listening',
	hit: 'The listener on {node} heard the click',
	miss: 'The click never passed {node}',
	clear: 'Empty the cart'
};
