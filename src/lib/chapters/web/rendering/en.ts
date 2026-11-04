import type { RenderingText } from './types';

export const en: RenderingText = {
	title: 'CSR, SSR, and SSG',
	intro: [
		'Before a page shows up on your screen, someone has to put it together, the header, the picture, the words, the buttons, all turned into finished [[HTML|web/html]]. That job is called <b>rendering</b>.',
		'There are only two places that can do it. The <b>server</b>, the computer far away that holds nimbus.com, or the <b>client</b>, which is your own phone or laptop. The big question is where it happens, and when.',
		'<b>CSR</b>, client side rendering. The server sends an empty page plus a big box of [[JavaScript|web/js]]. Your phone opens the box and builds the page itself. Until it is done, you stare at a blank screen.',
		'<b>SSR</b>, server side rendering. The server builds the full page the moment you ask, and sends it ready to read. Then a little JavaScript wakes up the buttons, a step called <b>hydration</b>.',
		'<b>SSG</b>, static site generation. The pages were built once, long before anyone visited, and wait on a shelf. Your visit just grabs a finished copy, often from a [[CDN|traffic/cdn]] close to you. Super fast, but every visitor sees the same page.',
		'[fyi] Modern frameworks mix all three. Next.js (for React), Nuxt (for Vue), and SvelteKit (for Svelte) let each page pick its own way. A blog post can be SSG while your cart uses SSR.',
		'[ingat] CSR is flat pack furniture, you build it yourself at home. SSR is a restaurant that cooks your plate when you order. SSG is bread on the bakery shelf, baked this morning, just grab it.',
		'Your turn, if you like. Pick a way and watch the same page arrive again.'
	],
	reactions: {
		csr: 'Felt that blank wait? Your phone had to download the box and build everything itself. On a cheap phone with weak signal, that wait gets long.',
		ssr: 'Much sooner. The server did the building, so the page arrived ready to read, and the buttons woke up a moment later.',
		ssg: 'Almost instant. The page was built long ago, so it was simply handed over. Perfect for pages that look the same for everyone.'
	},
	steps: [
		{
			title: 'Rendering',
			body: 'Putting the parts of a page together into finished <b>HTML</b> that a screen can show.'
		},
		{
			title: 'Server or client',
			body: 'The <b>server</b> is the far away computer. The <b>client</b> is your own device. Either one can do the building.'
		},
		{
			title: 'CSR',
			body: '<b>Client side rendering.</b> Your device builds the page from JavaScript. Blank at first, then lively.'
		},
		{
			title: 'SSR',
			body: '<b>Server side rendering.</b> The server builds it on every request. Readable fast, then <b>hydration</b> makes the buttons work.'
		},
		{
			title: 'SSG',
			body: '<b>Static site generation.</b> Built ahead of time and stored as files. The fastest, but the same for everyone.'
		},
		{
			title: 'Mix and match',
			tag: 'By the way',
			body: '<b>Next.js</b>, <b>Nuxt</b>, and <b>SvelteKit</b> let each page choose. Watch the three ways take turns.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'CSR is <b>flat pack</b>, SSR is a <b>restaurant</b>, SSG is the <b>bakery shelf</b>.'
		}
	],
	modes: { csr: 'CSR', ssr: 'SSR', ssg: 'SSG' },
	youLabel: 'You',
	serverLabel: 'Server',
	shelfLabel: 'Ready pages',
	status: {
		build: 'The parts come together into one page',
		where: 'Who builds it, the server or your phone?',
		ask: 'Your phone asks for nimbus.com',
		emptyHtml: 'An empty page and a box of JavaScript arrive',
		jsBuilds: 'Your phone builds the page itself',
		serverBuilds: 'The server builds the page right now',
		fullHtml: 'The full page arrives, ready to read',
		hydrate: 'JavaScript wakes up the buttons (hydration)',
		prebuilt: 'A finished page comes straight off the shelf',
		ready: 'Ready'
	},
	readyAfter: 'Readable after {s} s'
};
