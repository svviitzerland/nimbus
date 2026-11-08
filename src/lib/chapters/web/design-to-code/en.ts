import type { DesignToCodeText } from './types';

export const en: DesignToCodeText = {
	title: 'Design to code',
	intro: [
		'Before a page is built, someone usually draws it first. A <b>designer</b> plans every screen in a design tool, and the most popular one today is <b>Figma</b>, which runs right in your browser.',
		'A design is not just a pretty picture. Every shape in it carries exact numbers, the colour as a code like <b>#2E6FE0</b>, the corner roundness in pixels, the space inside a button, the size of the text.',
		'A developer opens the design, taps an element, and reads those numbers in an <b>inspect</b> panel. Then they write the same numbers into [[CSS|web/css]], the language that dresses up the [[HTML|web/html]] skeleton.',
		'[fyi] Teams often name their common values, like "brand blue" or "space 16", and keep them in one shared list called a <b>design system</b>. Then design and code always speak the same words.',
		'[ingat] Work like a tailor, not a painter. A tailor never guesses a size, they read the tape. Colour, corners, padding, letter size, four numbers make one button.',
		'Here is the nimbus.com "Start now" button as the designer drew it, and your version in code, still a bit off. Inspect the design, then tweak your CSS until the two match.'
	],
	reactions: {
		inspect:
			'There are the real numbers. Designers measure in pixels (tiny dots on the screen) and write colours as hex codes. Now copy them into your CSS.',
		color:
			'Colour matches. In CSS that is <b>background</b>. Hex codes like #2E6FE0 mix red, green, and blue, two characters for each.',
		radius:
			'Corners match. <b>border-radius</b> rounds them off, 0 is a sharp box and bigger numbers get softer.',
		padding:
			'Spacing matches. <b>padding</b> is the breathing room between the text and the edge of the button.',
		font: 'Text size matches. <b>font-size</b> sets how big the letters are, and it is a big part of how important something feels.',
		done: 'Pixel perfect! Your button now matches the design exactly. That is the everyday job of a frontend developer, turning a design into real code that a browser can draw.'
	},
	designLabel: 'Design (Figma)',
	pageLabel: 'Your page',
	button: 'Start now',
	inspect: 'Inspect the design',
	specLabel: 'Inspect',
	props: { color: 'Fill', radius: 'Corner radius', padding: 'Padding sides', font: 'Font size' },
	inspectHint: 'Tap inspect to see the numbers',
	codeLabel: 'style.css',
	matched: 'Your page matches the design',
	score: '{n} of {total} match'
};
