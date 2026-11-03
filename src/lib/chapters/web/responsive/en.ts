import type { ResponsiveText } from './types';

export const en: ResponsiveText = {
	title: 'Responsive design',
	intro: [
		'People open nimbus.com on all kinds of screens. A phone in one hand, a tablet on the couch, a wide laptop at work. One screen can be four times wider than another, yet it is the same page.',
		'In the early days, sites were built for one desk sized screen. Open them on a phone and everything shrinks to ant size, or you scroll sideways forever just to finish a sentence.',
		'The fix is <b>responsive design</b>, one page that rearranges itself to fit whatever screen it lands on. Three cards side by side on a laptop become one neat column on a phone.',
		'The trick is a [[CSS|web/css]] rule called a <b>media query</b>. It says "only use these lines when the screen is at least 600 pixels wide". The width where the layout changes is called a <b>breakpoint</b>.',
		'Most teams design for the phone first, then add media queries as the screen grows. That is called <b>mobile first</b>, because these days most people visit websites on their phones.',
		'[fyi] Same word, different world. Programmers also say breakpoint when they pause a running program to peek inside it. A totally different thing that happens to share the name.',
		'Your turn! Drag the screen from phone to laptop width and watch nimbus.com rearrange. Then switch the responsive CSS off and feel what a phone has to suffer through.'
	],
	reactions: {
		phone:
			'Phone size. Everything stacks into one column and the menu folds into a single button. Nothing to scroll sideways, your thumb only ever goes down.',
		tablet:
			'Past 600 pixels the first media query kicks in. Now there is room for two cards side by side, and the picture moves up next to the title.',
		laptop:
			'Past 900 pixels the second media query wakes up. The menu links come back out and all three cards sit in one row. Same HTML the whole time, only the CSS chose differently.',
		fixed:
			'Ouch. Without the responsive rules the page insists on being 960 pixels wide, so on a phone you scroll sideways to read anything. Lots of sites felt like this before smartphones took over.',
		done: 'One page that fits every screen. Responsive design is just CSS that checks the screen width before choosing a layout. Next up, making the page work for everyone, that is [[accessibility|web/a11y]].'
	},
	missionsLabel: 'Try nimbus.com on every screen',
	missions: {
		phone: 'Shrink it to a phone',
		tablet: 'Stop at tablet size',
		laptop: 'Stretch it to a laptop',
		fixed: 'Turn responsive off on a phone'
	},
	widthLabel: 'Screen width',
	presets: { phone: 'Phone', tablet: 'Tablet', laptop: 'Laptop' },
	toggleLabel: 'Responsive CSS',
	on: 'on',
	off: 'off',
	rulesLabel: 'Media queries in style.css',
	previewLabel: 'nimbus.com',
	layouts: {
		phone: 'One column',
		tablet: 'Two columns',
		laptop: 'Three columns',
		fixed: 'Stuck at 960 pixels'
	},
	page: {
		menu: 'Menu',
		links: ['Home', 'Learn', 'Blog'],
		heroTitle: 'Learn tech from zero',
		heroText: 'Short lessons with Nim, right in your browser.',
		cta: 'Start now',
		cards: [
			{ title: 'Networks', text: 'How devices talk.' },
			{ title: 'The web', text: 'How pages are built.' },
			{ title: 'The cloud', text: 'Servers you rent.' }
		]
	},
	allDone: 'All four done, nimbus.com fits every screen'
};
