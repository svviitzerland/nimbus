import type { BrowserText } from './types';

export const en: BrowserText = {
	title: 'How a browser works',
	intro: [
		'You type <b>nimbus.com</b> and a page appears almost instantly. It feels like one thing arriving, but your browser is quietly building the page piece by piece. Let us slow it right down and watch.',
		'First the browser asks the server for the page with an [[HTTP|web/http]] request. Back comes one file, <b>index.html</b>. It is just text with [[tags|web/html]] in it, so there is nothing to see on screen yet.',
		'The browser reads that HTML from top to bottom and turns it into a family tree. Every heading, paragraph, and button becomes a branch. That tree has a name, the <b>DOM</b>.',
		'Now it works out where every box goes (that is called <b>layout</b>) and colours in the pixels (that is called <b>paint</b>). Here is the very first look. Plain fonts, a grey button, and an empty spot waiting for a picture.',
		'While reading the HTML, the browser noticed the page also needs <b>style.css</b>. That file arrives, every rule finds its branch in the tree, and the page gets painted again in its real colours.',
		'Then <b>nim.png</b> shows up. Pictures are often the heaviest files, so they tend to arrive last. It drops right into the spot the HTML saved for it.',
		'Last comes <b>app.js</b>, the JavaScript. Now the page can react. Watch the Like button count up by itself, without asking the server for a new page.',
		'[ingat] A page gets ready like you do in the morning. <b>Bones first, then clothes, then you start moving.</b> HTML, then CSS, then JavaScript.',
		'[fyi] Same word, different world. <b>Rendering</b> means turning code into what you see. Your browser renders on your phone, but a server can also render the HTML before sending it, which developers call [[server side rendering|web/rendering]]. Same job, different place.',
		'Curious what CSS really does? Flip the switch to take it away and watch the page lose its outfit. Or just enjoy the finished page, that is fine too.'
	],
	reactions: {
		nocss:
			'CSS off, and the page drops straight back to its bones. The words, the picture, and the button are all still there, they only lost their outfit. CSS changes the look, never the content.',
		cssback:
			'CSS back on. The browser matched every rule to the tree again and repainted, all in a blink.'
	},
	steps: [
		{
			tag: 'The start',
			title: 'Typing nimbus.com',
			body: 'It all starts in the address bar. Behind it, the browser is about to fetch a small pile of files.'
		},
		{
			tag: 'File 1',
			title: 'index.html',
			body: 'The page, written as text with tags. This file says <b>what</b> is on the page, not how it looks.'
		},
		{
			tag: 'The tree',
			title: 'DOM',
			body: 'A family tree of the page. <b>body</b> is the parent, and the heading, paragraph, and button are its children.'
		},
		{
			tag: 'Drawing',
			title: 'Layout and paint',
			body: '<b>Layout</b> decides where each box sits, <b>paint</b> fills in the pixels. It happens again whenever something new arrives.'
		},
		{
			tag: 'File 2',
			title: 'style.css',
			body: 'Colours, fonts, spacing, rounded corners. The content stays the same, only the look changes.'
		},
		{
			tag: 'File 3',
			title: 'nim.png',
			body: 'A picture is its own file with its own request. The text does not have to wait for it.'
		},
		{
			tag: 'File 4',
			title: 'app.js',
			body: 'JavaScript changes the tree while you watch, so the page reacts without loading again.'
		},
		{
			tag: 'Make it stick',
			title: 'Bones, clothes, moves',
			body: '<b>HTML</b> is the bones, <b>CSS</b> the clothes, <b>JavaScript</b> the moves. They usually arrive in that order.'
		},
		{
			tag: 'Same word',
			title: 'Rendering',
			body: 'Turning code into pixels. Normally it happens on your device, with server side rendering it starts on the server.'
		},
		{
			tag: 'Optional',
			title: 'Take the CSS away',
			body: 'Flip the switch and the page goes back to bare bones. Everything is still there, only the look is gone.'
		}
	],
	filesLabel: 'Files arriving',
	domLabel: 'The DOM tree',
	blank: 'Nothing painted yet',
	page: {
		nav: ['Home', 'Blog', 'About'],
		heading: 'Welcome to Nimbus',
		text: 'Learn how the internet really works, one small step at a time.',
		alt: 'Nim the cloud',
		like: 'Like',
		tips: [
			'Every page is a small pile of files',
			'CSS changes the look, never the content',
			'JavaScript is what makes a page react',
			'Pictures usually arrive last'
		]
	},
	cssToggle: 'CSS',
	on: 'on',
	off: 'off'
};
