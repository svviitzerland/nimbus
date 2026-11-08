import type { BrowserText } from './types';

export const en: BrowserText = {
	title: 'How a browser works',
	intro: [
		'When nimbus.com opens, the browser requests HTML and the resources it needs. It processes them to display the page and run interactions.',
		'The first [[HTTP|web/http]] request in this example asks for an <b>HTML</b> file. It structures page elements using [[tags|web/html]].',
		'The browser reads that HTML from top to bottom and turns it into a tree, where every heading, paragraph, and button becomes a branch. That tree is called the <b>DOM</b>. While reading, it spots other files the page needs and asks for those too.',
		'Usually there is a <b>CSS</b> file for the look (colours, fonts, spacing), pictures like <b>nim.png</b>, and a <b>JavaScript</b> file that makes things move and react. Each one is its own little request.',
		'With every new piece, the browser works out where each box goes (that is <b>layout</b>) and then colours in the pixels on your screen (that is <b>paint</b>). Normally the whole thing takes well under a second.',
		'[fyi] Same word, different world. <b>Rendering</b> means turning code into what you see. Your browser renders on your phone, but a server can also render the HTML before sending it, which developers call server side rendering. Same job, different place.',
		'[ingat] <b>HTML structures content, CSS controls appearance, and JavaScript adds behavior.</b> The browser processes them to display a page.',
		'Request nimbus.com and watch the page change as HTML, CSS, images, and JavaScript are processed. The sequence is slowed down for this demonstration.'
	],
	reactions: {
		html: 'HTML has arrived and the browser builds the DOM. The page still uses default styling because CSS has not been applied. Images are requested separately.',
		css: 'style.css has arrived. The browser applies color, size, and layout rules to matching elements.',
		img: 'nim.png arrived and got painted into the spot the HTML saved for it. Pictures are often the heaviest files, which is why on slow internet you see the text first and pictures pop in later.',
		deadbutton:
			'The button is visible, but the code that increments the count has not loaded. Load JavaScript to enable this action.',
		js: 'app.js is running now. Tap Like and watch it count, and see the little line under it change on its own. Then try switching CSS or JavaScript off to see what each one really does.',
		liked:
			'The count went up without asking the server for a new page. That is JavaScript changing the DOM right there on your phone, and the browser repaints just that tiny bit.',
		nocss:
			'CSS is disabled. The HTML content and Like button remain, but the page returns to default browser styling.',
		nojs: 'JavaScript is disabled. The appearance remains, but the Like button no longer increments the count.',
		again: 'The tab is cleared. Run it again to see each file’s role in this example.'
	},
	steps: ['Ask for nimbus.com', 'Fetch style.css', 'Fetch nim.png', 'Fetch app.js'],
	again: 'Empty the tab',
	networkLabel: 'Files arriving',
	downloading: '{file} is on its way',
	fileRoles: {
		html: 'page structure',
		css: 'page styling',
		img: 'a picture',
		js: 'page interactions'
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
