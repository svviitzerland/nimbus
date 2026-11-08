import type { JsText } from './types';

export const en: JsText = {
	title: 'What is JavaScript',
	intro: [
		'The nimbus.com page already uses HTML and CSS. The cart button has no click action yet. We will add one.',
		'<b>JavaScript</b> is a programming language browsers can run. Here, its code increases the item count when the button is clicked.',
		'Most JavaScript on a page is waiting for something to happen, a tap, a key press, a scroll. You tell it what to listen for and what to do then. That waiting and reacting is what makes a page feel alive.',
		'A little vocabulary. <b>let count = 0</b> makes a box called a <b>variable</b> that holds a number. <b>addEventListener</b> means "listen for this". The code inside the curly brackets runs every time it hears it.',
		'[fyi] Despite the name, JavaScript has nothing to do with Java. It was built in about 10 days in 1995 for the Netscape browser, and the name was mostly marketing, because Java was the hot thing back then.',
		'JavaScript is also strict. One missing bracket and the browser stops reading that whole script, so nothing in it runs. You will see that with your own eyes in a moment.',
		'[ingat] To handle a click, JavaScript selects an element, attaches an event listener, and runs a function when the button is clicked.',
		'Your turn! Here is a tiny shop on nimbus.com. Make the cart count up, change how much one tap adds, then break a line on purpose and see what happens.'
	],
	reactions: {
		count:
			'It counts! Every tap fires a <b>click</b> event, the listener hears it, adds one to <b>count</b>, and writes the new number onto the page.',
		step: 'Now one tap adds more. You changed a single number in the code and the button behaves differently. That is programming in a nutshell, small instructions you can tweak.',
		broken:
			'Uh oh, look at the console. The browser hit something it cannot read and stopped right there. The error even tells you which line to look at.',
		dead: 'See? The button is dead now. The script broke before it reached <b>addEventListener</b>, so nobody is listening for your tap anymore.',
		fixed:
			'Back to life! Fix the line, the script runs again, and the listener is back. Developers do this all day long, break something, read the error, fix it.',
		loop: '[fyi] Nim switched loops off in this little playground, so a loop that never ends cannot freeze your page. Real pages use them all the time.',
		done: 'You made a page react, broke it, and fixed it again. Next, let us peek at what JavaScript is really changing behind the scenes, the [[DOM|web/dom]].'
	},
	missionsLabel: 'Add shop interactions',
	missions: {
		count: 'Tap Add to cart and watch it count',
		step: 'Make one tap add 2',
		broken: 'Break a line on purpose',
		fixed: 'Fix it so the button works again'
	},
	chipsLabel: 'Shortcuts if typing is fiddly',
	chips: { step: 'Make it add 2', breakIt: 'Delete a bracket', fix: 'Put it back' },
	jsLabel: 'script.js',
	htmlLabel: 'index.html',
	previewLabel: 'nimbus.com/shop',
	consoleLabel: 'Console',
	consoleEmpty: 'No errors reported',
	page: { product: 'Nim plush', price: '$12', button: 'Add to cart', cart: 'Cart' },
	comment: 'This runs inside the page',
	loopHint: 'Loops are switched off here, so the page will not run this version',
	allDone: 'Four JavaScript exercises completed',
	reset: 'Start over'
};
