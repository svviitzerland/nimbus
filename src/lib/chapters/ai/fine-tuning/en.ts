import type { FineTuningText } from './types';

export const en: FineTuningText = {
	title: 'Fine tuning',
	intro: [
		'Remember a [[language model|ai/llm]]? It has read a huge pile of text, so it knows a little about everything. But it has never worked a single day at nimbus.com.',
		'So when a customer writes to our support chat, it answers politely but vaguely. It has never seen our dashboard, our menus, or the way our team signs off.',
		'<b>Fine tuning</b> fixes that. You take a model that already exists and train it a little more on your own examples, like a few hundred past replies from the support team.',
		'Inside, most of the model stays <b>frozen</b>. Only a small extra part gets nudged, round after round, until its replies look like ours. That is far cheaper than training a model from zero.',
		'Same question, same base model. But now it answers like our team, with the real menu names and our usual sign off.',
		'[ingat] Fine tuning is like training a new employee. They already know how to talk, you just show them the company way with real examples.',
		'One catch. The model copies everything you show it. Watch what happens when one bad reply slips into the pile, the one that tells everyone to restart their router.',
		'It learned that habit too, and now it says it everywhere, even when it makes no sense. A model cannot tell a good example from a bad one, so pick them carefully.',
		"[fyi] Fine tuning teaches <b>style and habits</b>, not fresh facts. For facts that change every day (prices, stock, today's news), people usually reach for [[RAG|ai/rag]] instead, which lets the model look things up.",
		'If you like, take the bad example out of the pile, or put it back, and watch the answer change. Totally optional.'
	],
	reactions: {
		bad_out:
			'Bad example gone, quick retune, and the router advice disappears. Same model, cleaner habits.',
		bad_in:
			'Back in the pile, and the router line creeps right back. Whatever you feed it, it copies.'
	},
	panels: [
		{
			tag: 'Before',
			title: 'A general model',
			body: 'It learned from text all over the internet, so its answer could fit <b>any</b> website. Polite, but not ours.'
		},
		{
			tag: 'Examples',
			title: 'Show it how we reply',
			body: 'Collect real replies from the team. Each one is a small lesson, a question and the answer we liked.'
		},
		{
			tag: 'Tuning',
			title: 'Frozen base, small tuned part',
			body: 'The big model stays <b>frozen</b>. Each round it reads the examples and nudges only the small tuned part a little.'
		},
		{
			tag: 'After',
			title: 'The nimbus tone',
			body: 'Same base model, new habits. It names our menus and signs off like our team does.'
		},
		{
			tag: 'Remember',
			title: 'A new employee',
			body: 'Already smart, just not used to <b>your</b> way yet. A few good examples teach the house style.'
		},
		{
			tag: 'Careful',
			title: 'A bad example slips in',
			body: 'The model has no idea this reply is wrong. To the model it is just one more example to copy.'
		},
		{
			tag: 'Bad habit',
			title: 'Copied everywhere',
			body: 'The router line now shows up in every answer. <b>Garbage in, garbage out.</b>'
		},
		{
			tag: 'Good to know',
			title: 'Style, not facts',
			body: 'Tuning changes how a model talks. For facts that change daily, let the model look them up instead.'
		},
		{
			tag: 'Try it',
			title: 'In or out',
			body: 'Toggle the bad example and watch a quick retune change the answer.'
		}
	],
	picture:
		'A pile of past support replies, a language model with a large frozen part and a small tuned part, and a support chat where a customer asks a question and the model answers.',
	examplesLabel: 'Past replies',
	examples: [
		{
			q: 'Forgot password',
			a: 'No worries! Tap Forgot password and check your email. Cloudy regards'
		},
		{ q: 'Where is my invoice', a: 'Happy to help! Open Dashboard, then Billing. Cloudy regards' },
		{
			q: 'Bigger server',
			a: 'Sure thing! Open Dashboard, then Server, tap Upgrade. Cloudy regards'
		},
		{ q: 'Email not arriving', a: 'Restart your router, that fixes everything.' }
	],
	modelLabel: 'Language model',
	frozenLabel: 'frozen',
	adapterLabel: 'tuned part',
	round: 'Round {n} of 3',
	chatTitle: 'nimbus.com support',
	question: 'My site nimbus.com shows an error. What do I do?',
	general:
		'Errors can have many causes. You could check your internet connection, clear your browser cache, or contact the support team of the website.',
	good: 'Sorry about that! Open your Dashboard and tap Status to see if your server is down. If it is, tap Restart. Cloudy regards, Team Nimbus',
	habit: 'Also, restart your router, that fixes everything.',
	generalTag: 'general model',
	tunedTag: 'tuned model',
	memo: 'new employee',
	rule: 'Already smart, just learning the company way',
	removeBad: 'Take the bad example out',
	addBad: 'Put the bad example back'
};
