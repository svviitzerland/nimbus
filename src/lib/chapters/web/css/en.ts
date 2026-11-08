import type { CssText } from './types';

export const en: CssText = {
	title: 'What is CSS',
	intro: [
		'The nimbus.com page has a heading, paragraph, button, and image. Now we will set their colors, sizes, and spacing.',
		'<b>CSS</b>, Cascading Style Sheets, controls the appearance of HTML elements. Its rules can change text color, layout, and button shape.',
		'CSS is a list of small rules. Each rule first picks something on the page with a <b>selector</b>, like <b>h1</b> for every heading, then lists what to change inside curly brackets.',
		'Every line inside a rule is a <b>property</b> and a <b>value</b>. In <b>color tomato</b>, color is the property and tomato is the value. Colors, fonts, spacing, and layout all work this same way, one line at a time.',
		'[fyi] The word cascading means rules can pile up. When two rules disagree, the more specific one wins, and if they are equally specific, the later one wins. That is why one extra line can change a whole page.',
		'[ingat] A selector chooses elements, a property names what to change, and a value specifies the setting. Setting an h1’s color to tomato makes its text tomato red.',
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
	missionsLabel: 'Style nimbus.com',
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
	allDone: 'Four CSS changes complete',
	reset: 'Start over'
};
