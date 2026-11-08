import type { BackendFrameworksText } from './types';

export const en: BackendFrameworksText = {
	title: 'Backend frameworks',
	intro: [
		'Remember the order from earlier? To the backend it arrives as a request, <b>POST /orders</b>, and some code has to handle it. That piece of code is called an <b>endpoint</b>.',
		'Even this one small endpoint has a lot of chores. Notice which address was hit, read the form, check the numbers make sense, block fake requests, save to the database, and send an answer back.',
		'Every shop on the internet needs those same chores, over and over. So people bundled the boring, risky parts into a ready made toolkit called a <b>framework</b>. You write only the part that is special to your shop.',
		'Each popular language has its favourites. <b>Laravel</b> for PHP, <b>Express</b> for JavaScript, <b>Django</b> for Python, and <b>Spring</b> for Java. Different words, the same idea underneath.',
		'[fyi] Same word, different world. The frontend has frameworks too (like React or Svelte), and they solve a different problem, building the screen. More on those in [[frontend frameworks|web/why-framework]].',
		'[ingat] A framework provides structure and common features such as routing. Application logic and security configuration still need implementation and testing.',
		'First write the order endpoint by hand, chore by chore, and watch the code pile up. Then pick a framework and see how much of it simply disappears.'
	],
	reactions: {
		route:
			'Routing done. The code now checks the method and the address, so only POST /orders lands here. A real shop has hundreds of these.',
		read: 'The form arrives as raw text in small chunks, so you have to collect it and pull the fields out yourself. Tedious, right?',
		validate:
			'Never trust what comes in. Someone could order minus five caps. Checking every field is boring work that is easy to forget.',
		security:
			'This one blocks forged requests (an attack called CSRF), where another site tricks your browser into ordering for you. Forget it and nobody notices, until someone does.',
		db: 'Talking to the database means opening a connection, writing the query, and remembering to close it. One mistake here and data leaks or the server slowly runs dry.',
		respond: 'Finally the answer goes back. Phew, all that for a single endpoint.',
		byhand:
			'All six chores written by hand, and look at the line count. Now imagine doing this for login, cart, search, and payment too. Pick a framework.',
		laravel:
			'Laravel (PHP). Routing, form reading, validation, CSRF protection, and the database helper are all built in. What is left is mostly your shop logic.',
		express:
			'Express (JavaScript) is the minimalist one. It handles routing and responses, then lets you add small packages for the rest. Lighter, but you choose more yourself.',
		django:
			'Django (Python) is famous for being batteries included. Forms, validation, CSRF, and the database layer (called an ORM) come in the box.',
		spring:
			'Spring (Java) is the big one many banks and large companies use. A few annotations (those words starting with @) set up routing, validation, and saving.'
	},
	byHand: 'By hand',
	choresLabel: 'Chores for POST /orders',
	writeHint: 'Tap a chore to write its code',
	chores: {
		route: 'Routing',
		read: 'Read the form',
		validate: 'Validate input',
		security: 'Block forged requests',
		db: 'Save to the database',
		respond: 'Send a response'
	},
	lines: '{n} lines',
	built: 'built in',
	addon: 'add a package',
	todo: 'not written yet',
	frameworks: {
		laravel: { lang: 'PHP', blurb: 'Batteries included, loved by small teams' },
		express: { lang: 'JavaScript', blurb: 'Tiny core, add what you need' },
		django: { lang: 'Python', blurb: 'Batteries included, admin page for free' },
		spring: { lang: 'Java', blurb: 'Big and sturdy, common in large companies' }
	}
};
