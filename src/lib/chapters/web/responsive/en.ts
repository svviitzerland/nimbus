import type { ResponsiveText } from './types';

export const en: ResponsiveText = {
	title: 'Responsive design',
	intro: [
		'People open nimbus.com on all kinds of screens, a phone in one hand, a tablet on the couch, a wide laptop at work. Here it is on a laptop, looking fine.',
		'But this page was built the old way, locked at 960 pixels wide. Watch the screen shrink to a phone. The page refuses to fit, so you scroll sideways forever just to finish a sentence.',
		'The fix is <b>responsive design</b>, one page that rearranges itself to fit any screen. Nim rewrites the [[CSS|web/css]], starting with the phone. One column of cards, nothing wider than the screen.',
		'Now the screen grows to a tablet. Nim adds a <b>media query</b>, a block of CSS that only counts when the screen is at least 600 pixels wide. Two cards per row, and the page reflows by itself.',
		'One more for laptops, from 900 pixels up. Three cards in a row and the menu links come out. The widths where the layout changes, 600 and 900 here, are called <b>breakpoints</b>.',
		'Watch the screen grow and shrink on its own. Every time it crosses a breakpoint the cards jump into a new arrangement. Same HTML the whole time, only the CSS chooses differently.',
		'[fyi] Same word, different world. Programmers also say breakpoint when they pause a running program to peek inside it. A totally different thing that happens to share the name.',
		'[ingat] Think small first. Write the phone layout, then add one media query for each bigger screen. Read <b>min-width 600px</b> as "from 600 pixels and up".',
		'That is responsive design, CSS that checks the screen width before choosing a layout. Drag the slider if you want to catch the jumps yourself. Next up, a page for everyone, [[accessibility|web/a11y]].'
	],
	reactions: {
		drag: 'You are the screen now. Watch the moment you cross 600 or 900, that is a media query switching on or off.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'One page, many screens',
			body: 'A phone is around 360 pixels wide, a laptop 1000 or more. The same page has to look right on all of them.'
		},
		{
			title: 'A fixed width',
			body: '<b>width 960px</b> forces the page to stay laptop wide. On a phone it spills past the edge of the screen.'
		},
		{
			title: 'Phone first',
			body: 'Start with the smallest screen. One column, so nothing is ever wider than the phone itself.'
		},
		{
			title: 'A media query',
			body: 'The block starting with <b>@media</b> only applies when the screen is at least 600 pixels wide. On a phone it is simply skipped.'
		},
		{
			title: 'Breakpoints',
			body: "The ruler marks 600 and 900, this page's breakpoints. Past 900 the second media query wakes up too."
		},
		{
			title: 'Reflow',
			body: 'The browser checks the width all the time. Cross a breakpoint and it rearranges the page instantly.'
		},
		{
			title: 'Two meanings',
			body: 'In debugging, a breakpoint pauses a running program. Same word, a completely different tool.'
		},
		{
			tag: 'Make it stick',
			title: 'Small first, then wider',
			body: '<b>min-width</b> means "from this width and up". Phone layout first, one media query per bigger screen.'
		},
		{
			title: 'Your turn, if you like',
			body: 'Drag the slider to resize the screen yourself and catch the moment the layout jumps.'
		}
	],
	cssLabel: 'style.css',
	previewLabel: 'nimbus.com',
	widthLabel: '{n} pixels wide',
	sizes: { phone: 'phone', tablet: 'tablet', laptop: 'laptop' },
	sliderLabel: 'Screen width',
	page: {
		menu: 'Menu',
		links: ['Home', 'Learn', 'Blog'],
		heroTitle: 'Learn tech from zero',
		heroText: 'Short lessons with Nim, right in your browser.',
		cards: [
			{ title: 'Networks', text: 'How devices talk.' },
			{ title: 'The web', text: 'How pages are built.' },
			{ title: 'The cloud', text: 'Servers you rent.' }
		]
	}
};
