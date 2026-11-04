import type { JsText } from './types';

export const en: JsText = {
	title: 'What is JavaScript',
	intro: [
		'Your nimbus.com shop has a skeleton (HTML) and clothes (CSS). But tap its button and nothing happens. The page cannot react yet, it just sits there looking nice.',
		'Reacting is the job of <b>JavaScript</b>, the third language every browser speaks. It is a list of instructions the browser follows, top to bottom. Nim writes the first one, a box called a <b>variable</b> that remembers a number.',
		'Next the code has to find the parts it will work with, the button and the number in the cart. Think of it as pointing at things on the page and giving them names.',
		'Now the important bit. <b>addEventListener</b> means "listen for this". Here it listens for a click, and the two lines inside run every time one happens.',
		'Watch the button get tapped. Each tap fires a click, the listener hears it, adds one to the count, and writes the new number onto the page.',
		'[fyi] Despite the name, JavaScript has nothing to do with Java. It was built in about ten days in 1995 for the Netscape browser, and the name was mostly marketing, since Java was the hot thing back then.',
		'JavaScript is strict though. Nim deletes one tiny bracket, and the browser stops reading the whole script. Look, the taps keep coming but nothing counts, and the console shows an error.',
		'Put the bracket back and everything works again. Developers do this all day long, read the error, find the line, fix it.',
		'[ingat] Almost all JavaScript on a page does three things, <b>find, listen, change</b>. Like a doorman, it knows which door to watch, waits for the bell, then opens up.',
		'Now it is your shop. Tap Add to cart yourself if you like, or switch it to add 2 per tap and watch the code rewrite itself. Next, we peek at what JavaScript really changes, the [[DOM|web/dom]].'
	],
	reactions: {
		tap: 'That was your own tap! The listener cannot tell you apart from Nim, it simply heard a click and ran its two lines.',
		step: 'One number changed in the code, and now the button behaves differently. That is programming in a nutshell, small instructions you can tweak.'
	},
	steps: [
		{
			tag: 'script.js',
			title: 'A page that just sits there',
			body: 'HTML gave it parts and CSS gave it looks, but nothing is listening to your taps yet.'
		},
		{
			title: 'A variable',
			body: '<b>let count = 0</b> makes a labelled box that holds a number. The code can read it and change it later.'
		},
		{
			title: 'Finding things',
			body: '<b>querySelector</b> finds one piece of the page, here the button and the cart number, so the code can use them.'
		},
		{
			title: 'A listener',
			body: 'It waits for a <b>click</b>. The lines inside the curly brackets run every single time it hears one.'
		},
		{
			title: 'It runs',
			body: 'Each tap adds one to <b>count</b>, then puts the new number into the page. Keep an eye on the cart.'
		},
		{
			title: 'Not Java',
			body: 'The two names are cousins only on paper. JavaScript runs in every browser, Java is a different language for other jobs.'
		},
		{
			title: 'One bracket missing',
			body: 'The browser cannot read the script, so it runs none of it. Nobody is listening, and the console says why.'
		},
		{
			title: 'Fixed',
			body: 'With the bracket back the whole script runs again, the listener returns, and taps count.'
		},
		{
			tag: 'Make it stick',
			title: 'Find, listen, change',
			body: '<b>querySelector</b> finds, <b>addEventListener</b> listens, and the lines inside change the page.'
		},
		{
			title: 'Your shop',
			body: 'Tap the button in the preview, or switch how much one tap adds. The script lives inside the preview only.'
		}
	],
	comment: 'nothing here yet, so the button does nothing',
	jsLabel: 'script.js',
	previewLabel: 'nimbus.com/shop',
	consoleLabel: 'Console',
	consoleEmpty: 'No errors, all quiet',
	page: { product: 'Nim plush', price: '$12', button: 'Add to cart', cart: 'Cart' },
	stepLabel: 'Each tap adds'
};
