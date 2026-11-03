import type { CssText } from './types';

export const en: CssText = {
	title: 'What is CSS',
	intro: [
		'Remember the nimbus.com page you built with [[HTML|web/html]]? It has a heading, a paragraph, a button, and Nim. It works, but it looks like a school form from 1995, black letters on plain white.',
		'That is because HTML only says what each part is. How it looks is a separate job, and that job belongs to <b>CSS</b> (short for Cascading Style Sheets). If HTML is the skeleton, CSS is the clothes.',
		'CSS is a list of small rules. Each rule first picks something on the page with a <b>selector</b>, like <b>h1</b> for every heading, then lists what to change inside curly brackets.',
		'Every line inside a rule is a <b>property</b> and a <b>value</b>. In <b>color tomato</b>, color is the property and tomato is the value. Colors, fonts, spacing, and layout all work this same way, one line at a time.',
		'[fyi] The word cascading means rules can pile up. When two rules disagree, the more specific one wins, and if they are equally specific, the later one wins. That is why one extra line can change a whole page.',
		'Your turn! The stylesheet for nimbus.com already has a few plain values. Change one line at a time, by typing or tapping a value, and watch the page dress up.'
	],
	reactions: {
		background:
			'The whole page changed color with one line. The rule picked <b>body</b>, the tag that wraps everything you see, so the new background spread across the whole page.',
		color:
			'Now the heading has its own color. Only the <b>h1</b> changed, because the selector picked just that tag. The paragraph stayed exactly as it was.',
		font: 'New font, and every piece of text switched at once. Tags inside <b>body</b> borrow their font from it (this is called inheritance), so you only had to say it once.',
		button:
			'Soft corners! <b>border-radius</b> rounds the edges of a box. The buttons, cards, and profile pictures in every app you use are shaped with lines like this one.',
		typo: 'Hmm, the browser skipped one line. CSS never complains when something is misspelled, it quietly ignores that line. So when a page refuses to change, look for a typo first.',
		center:
			'[fyi] <b>text-align</b> centered the text inside its box. Arranging boxes is the biggest part of CSS, and soon you will see a page rearrange itself for phones in [[responsive design|web/responsive]].',
		done: 'Same HTML, a totally different look. That is the deal, HTML says what things are and CSS says how they look. Next, let us make that button actually do something with [[JavaScript|web/js]].'
	},
	missionsLabel: 'Dress up nimbus.com',
	missions: {
		background: 'Paint the page background',
		color: 'Give the heading a color',
		font: 'Pick a new font',
		button: 'Round the button corners'
	},
	tryLabel: 'Tap a value to try it',
	extraLabel: 'A little extra',
	cssLabel: 'style.css',
	htmlLabel: 'index.html',
	previewLabel: 'nimbus.com',
	page: {
		heading: 'Welcome to Nimbus',
		paragraph: 'Your first website in the cloud.',
		button: 'Start now',
		alt: 'Nim the cloud'
	},
	starterComment: 'Change one value, then look at the page',
	typoHint: 'The browser skipped "{line}" because it does not know it',
	allDone: 'All four done, nimbus.com looks great',
	reset: 'Start over'
};
