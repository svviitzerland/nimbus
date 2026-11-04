import type { BackendFrameworksText } from './types';

export const en: BackendFrameworksText = {
	title: 'Backend frameworks',
	intro: [
		'Remember the order? To the backend it arrives as a request called <b>POST /orders</b>. The bit of code that handles one such address is called an <b>endpoint</b>.',
		'This one small endpoint has plenty of chores. Send the request to the right code, read the form, check that the numbers make sense.',
		'Then turn away fake requests, save to the database, and send an answer back. Watch the line count climb.',
		'Every shop on the internet needs the very same chores, again and again. So people packed them into a ready made toolbox called a <b>framework</b>. You only write the part that is special about your shop.',
		'Each language has a favourite. <b>Laravel</b> for PHP, <b>Express</b> for JavaScript, <b>Django</b> for Python, <b>Spring</b> for Java. Different names, same idea.',
		'[ingat] Framework literally means a frame. The walls and pipes are already up, you just furnish the rooms.',
		'[fyi] Same word, different world. The frontend has frameworks too (like React or Svelte), and they solve a different problem, building what you see. More in [[frontend frameworks|web/why-framework]].',
		'Want to feel the difference? Take the framework away and watch all those chores land back on you.'
	],
	reactions: {
		byhand:
			'Every chore is yours again, and the line count jumps. Now imagine doing this for login, the cart, search, and payments too.',
		framework:
			'Framework back, and it takes over most of the code. What is left is the part only your shop has.'
	},
	steps: [
		{
			title: 'Endpoint',
			body: 'The code that answers <b>one address</b>, like POST /orders. A real shop has hundreds of them.'
		},
		{
			title: 'Chores',
			body: '<b>Routing</b> sends the request to the right code. Then the form is read and <b>checked</b>, so nobody orders minus five caps.'
		},
		{
			title: 'More chores',
			body: 'Blocking <b>fake requests</b>, talking to the <b>database</b>, sending the <b>answer</b>. Boring, and easy to get wrong.'
		},
		{
			title: 'Framework',
			body: 'A ready made toolbox that <b>does the common chores</b> for you. Your code shrinks to what makes your shop yours.'
		},
		{
			title: 'Popular picks',
			body: 'Laravel (PHP), Express (JavaScript), Django (Python), Spring (Java). You pick the one for <b>your language</b>.'
		},
		{
			title: 'The frame of a house',
			tag: 'Make it stick',
			body: 'A framework is the <b>frame of a house</b>, you furnish the rooms.'
		},
		{
			title: 'Frontend frameworks',
			tag: 'Side note',
			body: 'React and Svelte build <b>what you see</b>. Backend frameworks handle <b>what you do not see</b>.'
		},
		{
			title: 'Same result, less code',
			body: 'Both ways save the order. The framework just means <b>far less code</b> to write and look after.'
		}
	],
	fileName: 'orders endpoint',
	requestTag: 'POST /orders',
	emptyHint: 'nothing written yet',
	lines: '{n} lines',
	chores: {
		route: { label: 'Routing', lines: 24 },
		read: { label: 'Read the form', lines: 36 },
		check: { label: 'Check the input', lines: 42 },
		guard: { label: 'Block fake requests', lines: 38 },
		db: { label: 'Save to database', lines: 52 },
		reply: { label: 'Send the answer', lines: 22 }
	},
	ready: 'ready',
	yourCode: 'Your shop logic',
	yourLines: 18,
	frameworks: [
		{ name: 'Laravel', lang: 'PHP' },
		{ name: 'Express', lang: 'JavaScript' },
		{ name: 'Django', lang: 'Python' },
		{ name: 'Spring', lang: 'Java' }
	],
	byHandBtn: 'Write it all by hand',
	frameworkBtn: 'Use the framework'
};
