import type { BrowserText } from './types';

export const en: BrowserText = {
	title: 'How a browser works',
	intro: [
		'You type <b>nimbus.com</b> and a page shows up almost instantly. It feels like one thing arriving, but behind the scenes your browser is juggling a pile of files and building the page piece by piece.',
		'First it asks the server for the page with an [[HTTP|web/http]] request. What comes back is an <b>HTML</b> file, the skeleton of the page, just text wrapped in [[tags|web/html]].',
		'The browser reads that HTML from top to bottom and turns it into a tree, where every heading, paragraph, and button becomes a branch. That tree is called the <b>DOM</b>. While reading, it spots other files the page needs and asks for those too.',
		'Usually there is a <b>CSS</b> file for the look (colours, fonts, spacing), pictures like <b>nim.png</b>, and a <b>JavaScript</b> file that makes things move and react. Each one is its own little request.',
		'With every new piece, the browser works out where each box goes (that is <b>layout</b>) and then colours in the pixels on your screen (that is <b>paint</b>). Normally the whole thing takes well under a second.',
		'[fyi] Same word, different world. <b>Rendering</b> means turning code into what you see. Your browser renders on your phone, but a server can also render the HTML before sending it, which developers call server side rendering. Same job, different place.',
		'Your turn, in slow motion. Ask for nimbus.com, then let each file arrive one at a time and watch the page grow, skeleton first, then colours, then the moving parts.'
	],
	reactions: {
		html: 'The HTML arrived, and the browser already built the DOM and painted it. Looks plain, right? Default fonts, underlined links, a grey button. That is the bare skeleton. The picture is missing too, because it is a separate file still on its way.',
		css: 'style.css landed. The browser matched each rule to its part of the DOM, laid the boxes out again, and repainted. Same content, whole new look. CSS never changes what is on the page, only how it looks.',
		img: 'nim.png arrived and got painted into the spot the HTML saved for it. Pictures are often the heaviest files, which is why on slow internet you see the text first and pictures pop in later.',
		deadbutton:
			'You tapped Like and nothing happened. The button is drawn, but no JavaScript has arrived to tell it what to do. HTML and CSS can only show things, not react.',
		js: 'app.js is running now. Tap Like and watch it count, and see the little line under it change on its own. Then try switching CSS or JavaScript off to see what each one really does.',
		liked:
			'The count went up without asking the server for a new page. That is JavaScript changing the DOM right there on your phone, and the browser repaints just that tiny bit.',
		nocss:
			'CSS off, and the page drops straight back to its skeleton. Everything is still there and Like still works, it just lost its outfit.',
		nojs: 'JavaScript off. The page still looks lovely, but Like went dead and the little line froze. Some sites break completely without JavaScript, so a well built page shows its content even without it.',
		again:
			'Back to an empty tab. Run it again and watch the order, it is always skeleton first, then the look, then the parts that move.'
	},
	steps: ['Ask for nimbus.com', 'Fetch style.css', 'Fetch nim.png', 'Fetch app.js'],
	again: 'Empty the tab',
	networkLabel: 'Files arriving',
	downloading: '{file} is on its way',
	fileRoles: {
		html: 'the skeleton',
		css: 'the look',
		img: 'a picture',
		js: 'the moving parts'
	},
	work: [
		'An empty tab, nothing asked for yet',
		'Reading the HTML, building the DOM, painting it plain',
		'Matching CSS rules, redoing the layout, painting in colour',
		'Painting the picture into its spot',
		'Running JavaScript, the page can react to you now'
	],
	blank: 'Nothing here yet',
	page: {
		nav: ['Home', 'Blog', 'About'],
		heading: 'Welcome to Nimbus',
		text: 'Learn how the internet really works, one small game at a time.',
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
	jsToggle: 'JavaScript',
	on: 'on',
	off: 'off'
};
