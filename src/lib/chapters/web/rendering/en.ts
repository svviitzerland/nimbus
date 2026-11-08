import type { RenderingText } from './types';

export const en: RenderingText = {
	title: 'CSR, SSR, and SSG',
	intro: [
		'Somewhere, someone has to turn your data and your components into the final [[HTML|web/html]] that a screen can show. That job is called <b>rendering</b>. The big question is where and when it happens.',
		'<b>CSR</b>, client side rendering. The server sends an almost empty page plus a big bundle of [[JavaScript|web/js]]. Your phone (the client) downloads it, runs it, and builds the page itself. Until then, you stare at a blank screen.',
		'<b>SSR</b>, server side rendering. The server builds the full page the moment you ask for it and sends it ready to read. Then a little JavaScript wakes up the buttons, a step called <b>hydration</b>.',
		'<b>SSG</b>, static site generation. The pages are built once, ahead of time, before anyone visits. Each visit just grabs a finished file, often from a [[CDN|traffic/cdn]] close to you, so it is lightning fast. The catch is that the content cannot change per visitor.',
		'[fyi] Modern frameworks mix all three. Next.js (for React), Nuxt (for Vue), and SvelteKit (for Svelte) let each page pick its own way. A blog post can be SSG while your cart uses SSR.',
		'[ingat] <b>CSR renders in the browser. SSR generates HTML for a request. SSG generates HTML at build time.</b>',
		'Time to feel it. Load the same nimbus.com page three ways on a slow phone, and watch when the content first shows up.'
	],
	reactions: {
		csr: 'Felt that wait? The page arrived empty, so your phone had to download all the JavaScript and build everything itself. On a slow phone, that blank screen lasts a while.',
		ssr: 'Much sooner! The server did the building, so the finished page arrived ready to read. The buttons woke up a moment later, once hydration finished.',
		ssg: 'Almost instant. The page was built long before you asked, so the server just handed over a ready file. Perfect for pages that look the same for everyone, like a blog post.',
		all: 'Look at the scoreboard. Same page, three very different waits. Try switching off slow phone and loading CSR again too.',
		fast: '[fyi] On a fast phone and a strong connection, the gap shrinks a lot. That is why CSR feels fine on your laptop but can feel painful for someone on a cheap phone and weak signal.'
	},
	modes: {
		csr: { label: 'CSR', sub: 'Your phone builds it' },
		ssr: { label: 'SSR', sub: 'Server builds it on request' },
		ssg: { label: 'SSG', sub: 'Built ahead of time' }
	},
	slow: 'Slow phone',
	youLabel: 'You',
	serverLabel: 'Server',
	shelfLabel: 'Ready files',
	steps: {
		ask: 'Your phone asks for nimbus.com',
		emptyHtml: 'An empty page arrives, nothing to show yet',
		downloadJs: 'Downloading a big JavaScript bundle',
		jsBuilds: 'Your phone runs the JavaScript and builds the page',
		serverBuilds: 'The server builds the page right now',
		fullHtml: 'The full page arrives, you can read it',
		hydrate: 'Hydration connects HTML to interaction code',
		prebuilt: 'The server sends HTML generated at build time',
		ready: 'Ready'
	},
	idle: 'Pick a way to load the page',
	scoreLabel: 'Content first showed after',
	firstPaint: '{s} s',
	fastTag: 'fast phone',
	notYet: 'not tried'
};
