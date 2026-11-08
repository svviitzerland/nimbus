import type { FineTuningText } from './types';

export const en: FineTuningText = {
	title: 'Fine tuning',
	intro: [
		'Remember a [[language model|ai/llm]]? It has read a huge pile of text from the internet, so it knows a little about everything. But it knows nothing about <b>your</b> business.',
		'Say nimbus.com wants a support bot. Ask a general model and it answers politely, but vaguely. It has never seen our dashboard, our menus, or the way our team always signs off.',
		'One fix is <b>fine tuning</b>. You take a model that already exists and train it a little more on your own examples, like a few hundred past support replies. Fine means small, the model only gets a small, careful adjustment.',
		"Inside, most of the model's [[weights|ai/neural-net]] stay <b>frozen</b>. Only a small extra part gets nudged, so it is far cheaper than training a model from zero, which can take months and millions of dollars.",
		"[fyi] Fine tuning teaches <b>style and habits</b>, not fresh facts. For facts that change every day (prices, stock, today's news), people usually reach for [[RAG|ai/rag]] instead, which lets the model look things up.",
		'One catch. The model copies whatever you show it, the good and the bad. Feed it rude replies and you get a rude bot.',
		'[ingat] Fine tuning trains an existing model on additional data to adapt its behavior to a particular task.',
		'Ask the general model a question first. Then pick past replies for the training set, tune it, and compare the two answers.'
	],
	reactions: {
		ask: "See? Not wrong, just generic. It has never seen our dashboard, so it says what any website might say. The tuned side is still empty because we haven't tuned anything yet.",
		pick: 'Nice pick. That reply is friendly, specific, and signs off like our team does. Exactly the habit we want it to learn.',
		pick_bad:
			'Hmm, read that one closely. Whatever goes into the training set, the model will happily copy.',
		tuning:
			'Tuning now. Each round it reads every example, checks how far its own reply is from ours, and nudges only the small tuned part a little.',
		tuned_good:
			'Look at the difference! Same base model, but now it talks like our support team, knows the menus, and signs off the same way. Try another question.',
		tuned_rude:
			"Oops, it learned the rude tone too. The model can't tell good examples from bad ones, it just copies. Take the rude one out and tune again.",
		tuned_wrong:
			'It picked up the router advice and now says it everywhere, even when it makes no sense. Take that example out and tune again.',
		stale:
			'You changed the training set, so the tuned model is out of date. Tune again to bake the new set in.',
		compare:
			'[fyi] Real fine tuning uses hundreds or thousands of examples, not five, but the idea is exactly this. Companies tune models to write medical notes, legal letters, or code in their own house style.'
	},
	questionsLabel: 'A customer asks',
	questions: [
		{
			q: 'My site nimbus.com shows an error',
			general:
				'Errors can have many causes. You could check your internet connection, clear your browser cache, or contact the support team of the website.',
			good: 'Sorry about that! Open your Nimbus dashboard and tap Status to see if your server is down. If it is, tap Restart. Still stuck? Reply here and we will jump in. Cloudy regards, Team Nimbus',
			rude: 'Open the dashboard and tap Status. We are busy. Team Nimbus'
		},
		{
			q: 'How do I add a new domain?',
			general:
				'Adding a domain usually involves buying it from a registrar and updating DNS settings. Steps vary by provider, so check their documentation.',
			good: 'Happy to help! Go to Dashboard, then Domains, and tap Add domain. We set up the DNS for you, it takes about five minutes. Cloudy regards, Team Nimbus',
			rude: 'Dashboard, Domains, Add domain. Read the FAQ next time. Team Nimbus'
		},
		{
			q: 'Can I cancel my plan?',
			general:
				'Most services let you cancel a subscription in your account settings. Some may charge a fee, so read the terms first.',
			good: 'Of course, and sorry to see you go! Open Dashboard, then Billing, and tap Cancel plan. Your site stays online until the month ends. Cloudy regards, Team Nimbus',
			rude: 'Billing, Cancel plan. Bye. Team Nimbus'
		}
	],
	examples: [
		{
			q: 'I forgot my password',
			a: 'No worries! Tap Forgot password on the login page and we will email you a link. Cloudy regards, Team Nimbus'
		},
		{ q: 'Why is my site slow?', a: 'Read the FAQ. We are busy.' },
		{
			q: 'Where is my invoice?',
			a: 'Happy to help! Open Dashboard, then Billing, and every invoice is there to download. Cloudy regards, Team Nimbus'
		},
		{ q: 'My email is not arriving', a: 'Restart your router, that fixes everything.' },
		{
			q: 'Can I get a bigger server?',
			a: 'Sure thing! Go to Dashboard, then Server, and tap Upgrade. It takes about a minute. Cloudy regards, Team Nimbus'
		}
	],
	examplesLabel: 'Past replies from our team',
	wrongAdd: 'Also, restart your router, that fixes everything.',
	generalLabel: 'General model',
	tunedLabel: 'Tuned model',
	notTuned: 'Not tuned yet',
	askHint: 'Tap a question above',
	stale: 'Training set changed, tune again',
	setCount: '{n} in the training set',
	tuneBtn: 'Tune the model',
	tuning: 'Tuning, round {n} of 3',
	frozen: 'Base model, frozen',
	adapter: 'Tuned part',
	qMark: 'Q',
	aMark: 'A',
	reset: 'Reset'
};
