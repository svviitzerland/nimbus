import type { DesignToCodeText } from './types';

export const en: DesignToCodeText = {
	title: 'Design to code',
	intro: [
		'Before a page is built, someone usually draws it first. A <b>designer</b> plans every screen in a design app, and the most popular one today is <b>Figma</b>, which runs right in your browser. Watch a button appear on the canvas.',
		'A design is not just a pretty picture. Every shape carries exact numbers. Here are the four that make this button, its colour as a code like <b>#2E6FE0</b>, how round the corners are, the space inside it, and the size of the letters.',
		'A developer taps the button in the design and reads those numbers in the <b>inspect</b> panel. Then they type the very same numbers into [[CSS|web/css]], the language that dresses up the [[HTML|web/html]] skeleton.',
		'Now the browser reads the CSS and draws the button. Watch it change one line at a time, first a plain grey box, then the colour, the round corners, the breathing room, and finally the letter size.',
		'Put the two side by side. The design and the real page now look exactly the same. Turning a drawing into matching code like this is the everyday job of a frontend developer.',
		'[fyi] Teams often give their common values a name, like brand blue or space 24, and keep them in one shared list called a <b>design system</b>. Then designers and developers say the same words and nothing drifts apart.',
		'[ingat] Do not eyeball it, read the numbers. Colour, corners, padding, letter size, four numbers make one button.',
		'Your turn, if you like. Leave out the padding line and see how fast the button stops looking like the design.'
	],
	reactions: {
		nopad:
			'Without padding the letters touch the edges and the button shrinks into a cramped little box. One missing number, and it no longer matches the design.',
		pad: 'Padding is back, and the button can breathe again. Design and page match once more.'
	},
	steps: [
		{
			title: 'The design',
			body: 'A <b>designer</b> draws the screens first, often in <b>Figma</b>. Nothing is coded yet, it is a plan everyone can look at.'
		},
		{
			title: 'Exact numbers',
			body: 'Every shape has measurements. Sizes are in <b>pixels</b> (the tiny dots on a screen), and colours are written as <b>hex codes</b>.'
		},
		{
			title: 'Inspect, then type',
			body: 'The developer reads each number in <b>inspect</b> and writes it into a CSS file. One number becomes one line.'
		},
		{
			title: 'The browser draws',
			body: '<b>background</b> sets the colour, <b>border-radius</b> rounds the corners, <b>padding</b> adds room inside, and <b>font-size</b> sets the letter size.'
		},
		{
			title: 'It matches',
			body: 'When every number is copied, the page looks <b>exactly</b> like the design. Designers call this pixel perfect.'
		},
		{
			title: 'Design system',
			tag: 'By the way',
			body: 'Shared names for shared values, like <b>brand blue</b>. Change it once in the list and both the design and the code follow.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Do not guess, <b>read the numbers</b>. Colour, corners, padding, letter size.'
		}
	],
	designLabel: 'Design (Figma)',
	pageLabel: 'nimbus.com',
	button: 'Start now',
	specLabel: 'Inspect',
	props: { color: 'Fill', radius: 'Corners', padding: 'Side padding', font: 'Font size' },
	tokens: { color: 'brand blue', radius: 'round', padding: 'space 24', font: 'text 16' },
	codeLabel: 'style.css',
	matched: 'Matches the design',
	mismatch: 'Does not match',
	skipPadding: 'Leave out the padding',
	restorePadding: 'Put the padding back'
};
