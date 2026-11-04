import type { HtmlText } from './types';

export const en: HtmlText = {
	title: 'What is HTML',
	intro: [
		'When you open <b>nimbus.com</b>, the server sends your browser a file called <b>index.html</b>. And here is the surprise, that file is just <b>plain text</b>. Letters and words, the same stuff you type in a chat.',
		'Plain text alone has no shape. The browser cannot tell which line is the big title, which one is a sentence, or where a button goes. So it squashes everything into one long line. Look at the preview.',
		'That is where <b>HTML</b> comes in. It wraps each piece of text in little labels called <b>tags</b>, so every piece knows what it is. Watch the first line get wrapped in <b>&lt;h1&gt;</b>, the tag for a big heading.',
		'A tag opens and then closes, like a pair of brackets. <b>&lt;h1&gt;</b> opens the heading and <b>&lt;/h1&gt;</b> closes it (spot the slash). Whatever sits between the two becomes the heading.',
		'Next line, <b>&lt;p&gt;</b>, short for paragraph. It tells the browser this is a normal block of text, so it gets its own line with a little space around it.',
		'Then <b>&lt;button&gt;</b>. One tag and the browser draws a real button. Pressing it does nothing yet, because HTML only builds the shape.',
		'Then a picture with <b>&lt;img&gt;</b>. It points at the picture file with <b>src</b> and describes it with <b>alt</b>, for anyone who cannot see it. It holds no text inside, so it never needs a closing tag.',
		'Now the tag that makes the web a web, <b>&lt;a&gt;</b>, a link. Its <b>href</b> holds the address it leads to, here <b>/about</b>. Tap it and the browser asks the server for that page. Billions of pages hold hands like this.',
		'Last, a <b>&lt;form&gt;</b>, a box for things you type. Inside sits an <b>&lt;input&gt;</b>, a field for your email, and a button. Press it and the browser packs up what you typed and sends it to the server as a <b>POST</b>, here to <b>/join</b>.',
		'[ingat] <b>HTML is the skeleton, CSS is the clothes, JavaScript is the muscles.</b> The skeleton only says what each part is. Dressing it up is the job of [[CSS|web/css]], making it move is the job of [[JavaScript|web/js]].',
		'The editor is yours now, if you like. Change one line, maybe the heading words, and watch the page follow along. Or leave it as it is, it is already a real web page.'
	],
	reactions: {
		edited:
			'See that? You changed the text and the page followed right away. Under the hood, every website you visit is text like this.',
		unclosed:
			'Hmm, one tag lost its partner. Every opening tag like <b>&lt;p&gt;</b> needs its closing one, <b>&lt;/p&gt;</b>, or the browser has to guess where it ends.'
	},
	steps: [
		{
			tag: 'The file',
			title: 'Plain text',
			body: '<b>index.html</b> is just characters. No sizes, no buttons, no pictures, only words.'
		},
		{
			tag: 'The problem',
			title: 'No shape',
			body: 'The browser ignores line breaks in plain text, so every line ends up in one heap.'
		},
		{
			tag: 'The fix',
			title: 'Tags',
			body: 'A tag is a name inside angle brackets, like <b>&lt;h1&gt;</b>. <b>h1</b> means heading number one, the biggest kind.'
		},
		{
			tag: 'A pair',
			title: 'Open and close',
			body: '<b>&lt;h1&gt;</b> starts it, <b>&lt;/h1&gt;</b> ends it. The slash means close.'
		},
		{
			tag: 'Tag 2',
			title: '&lt;p&gt;',
			body: 'A paragraph. Ordinary text on its own line.'
		},
		{
			tag: 'Tag 3',
			title: '&lt;button&gt;',
			body: 'A button you can press. HTML gives it a shape, not a job.'
		},
		{
			tag: 'Tag 4',
			title: '&lt;img&gt;',
			body: 'A picture. <b>src</b> says which file, <b>alt</b> says what it shows. No closing tag needed.'
		},
		{
			tag: 'Tag 5',
			title: '&lt;a href&gt;',
			body: 'A link. <b>href</b> says where it leads. Pages linked to pages, all over the world, are why it is called a <b>web</b>.'
		},
		{
			tag: 'Tag 6',
			title: '&lt;form&gt;',
			body: '<b>&lt;input&gt;</b> is a field to type in. The button inside the form sends what you typed to the server as a <b>POST</b> request.'
		},
		{
			tag: 'Make it stick',
			title: 'Skeleton, clothes, muscles',
			body: '<b>HTML</b> the skeleton, <b>CSS</b> the clothes, <b>JavaScript</b> the muscles.'
		},
		{
			tag: 'Optional',
			title: 'Change one line',
			body: 'Tap into the editor and change any words. The preview updates as you type.'
		}
	],
	editorLabel: 'index.html',
	previewLabel: 'nimbus.com',
	lines: {
		heading: 'Welcome to Nimbus',
		paragraph: 'Your first website in the cloud.',
		button: 'Start now',
		alt: 'Nim the cloud',
		link: 'About us',
		email: 'your email',
		join: 'Join'
	},
	serverLabel: 'nimbus.com server',
	editHint: 'You can edit this',
	unclosedHint: '{open} is still open, close it with {close}',
	reset: 'Start over'
};
