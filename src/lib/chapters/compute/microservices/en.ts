import type { MicroservicesText } from '../types';

export const en: MicroservicesText = {
	title: 'Monolith or microservices',
	intro: [
		'Your app is used by many people at once, each sending requests. Inside, it can be built in two ways. Let us look at both, and what changes when something breaks.',
		'First the <b>monolith</b>. Every feature, browsing, search, and pay, runs in <b>one and the same program</b>. Every user request is served by that program. While it is healthy, all is smooth.',
		'Now the payment feature breaks. But because every feature lives in the same one program, the moment it crashes, <b>everything goes down with it</b>. Watch, every user request fails, not just the paying one.',
		'The other shape is <b>microservices</b>. Each feature is split into <b>its own separate program</b>, often in its own container, and they talk through APIs.',
		'The payment feature breaks again. But because it is a separate program, <b>only the pay request fails</b>. Browsing and search are still served, since their programs are different and untouched.',
		'So a monolith is one program, simple to start but one crash takes it all down. Microservices are many separate programs, sturdy because a broken one does not drag the others, but more work to run. Neither is always better, pick what fits the need.'
	],
	reactions: {},
	userLabel: 'User',
	devLabel: 'Developer',
	monoLabel: 'Nimbus Shop',
	oneProgram: 'one program',
	sepPrograms: 'separate program',
	downTag: 'down',
	okTag: 'ok',
	failTag: 'failed',
	requests: [
		{ label: 'Browse', service: 'Storefront' },
		{ label: 'Search', service: 'Search' },
		{ label: 'Pay', service: 'Payments' }
	],
	recapMono: 'One program. Simple, but one crash kills every request.',
	recapMicro: 'Separate programs. One dies, the rest keep going, but more complex.'
};
