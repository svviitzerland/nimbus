import type { HtmlText } from './types';

export const en: HtmlText = {
	title: 'What is HTML',
	intro: [
		'The server sends an <b>HTML</b> document to the browser. This text document describes the page’s content and structure.',
		'Plain text alone has no shape. The browser cannot tell which line is the big title, which one is a sentence, or where a button should go. So it squashes everything together into one long line.',
		'<b>HTML</b> identifies page elements such as headings, paragraphs, and buttons. Elements are written using <b>tags</b>.',
		'A tag opens and then closes, like a pair of brackets. <b>&lt;h1&gt;</b> opens a heading and <b>&lt;/h1&gt;</b> closes it (see the slash). Whatever sits between the two becomes the heading.',
		'You will meet a handful of tags everywhere. <b>&lt;h1&gt;</b> for a heading, <b>&lt;p&gt;</b> for a paragraph, <b>&lt;button&gt;</b> for a button, <b>&lt;a&gt;</b> for a link, and <b>&lt;img&gt;</b> for a picture. That last one holds no text inside, so it never needs closing.',
		'[fyi] HTML structures elements. [[CSS|web/css]] controls their appearance, while [[JavaScript|web/js]] adds behavior and interaction.',
		'[ingat] <b>HTML defines element types and structure.</b> [[CSS|web/css]] controls appearance. [[JavaScript|web/js]] adds behavior and interaction.',
		'Your turn! nimbus.com is a bare page right now. Build its home page in four small missions. Tap a tag to drop it in, or type it yourself, and watch the browser change as you go.'
	],
	reactions: {
		heading:
			'There it is, a real heading. Now the browser knows that line is the big title of the page, so it shows it large and bold.',
		paragraph:
			'<b>&lt;p&gt;</b> marks a paragraph. The browser displays it as a text block with default styling that CSS can change.',
		button:
			'A button! Tap it and nothing happens yet, because HTML only builds the shape. Making it actually do something is what [[JavaScript|web/js]] is for.',
		image:
			'Look, Nim made it onto the page. <b>&lt;img&gt;</b> points at a picture with <b>src</b>, and <b>alt</b> describes it for anyone who cannot see it. No closing tag needed.',
		link: '[fyi] That is a link. <b>href</b> says where it leads. Links are what turn a pile of pages into a web, every page pointing at other pages.',
		unclosed:
			'Hmm, one tag is still open. Every opening tag like <b>&lt;p&gt;</b> needs its partner with a slash, <b>&lt;/p&gt;</b>, or the browser has to guess where it ends.',
		done: 'The page has a heading, paragraph, button, and image. [[CSS|web/css]] can give this HTML structure layout and color.'
	},
	missionsLabel: 'Build the nimbus.com home page',
	missions: {
		heading: 'Give the page a heading with h1',
		paragraph: 'Add a paragraph with p',
		button: 'Add a button',
		image: 'Put a picture of Nim on it with img'
	},
	chipsLabel: 'Tap a tag to add it',
	editorLabel: 'index.html',
	previewLabel: 'nimbus.com',
	starter: 'Welcome to Nimbus\nYour first website in the cloud\nStart now',
	snippets: {
		heading: 'Welcome to Nimbus',
		paragraph: 'Your first website in the cloud.',
		button: 'Start now',
		link: 'Read the blog',
		alt: 'Nim the cloud'
	},
	unclosedHint: '{open} is still open, close it with {close}',
	allDone: 'Four HTML elements complete',
	reset: 'Start over'
};
