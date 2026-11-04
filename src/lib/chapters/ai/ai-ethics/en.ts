import type { AiEthicsText } from './types';

export const en: AiEthicsText = {
	title: 'AI ethics',
	intro: [
		"Chatbots are handy for writing, translating, and explaining tricky homework. But before you hit send, it helps to know where your message goes. It leaves your phone and travels to the provider's servers ([[AI through APIs|ai/ai-api]]).",
		'There it is usually <b>kept</b> for a while. Staff may <b>read</b> it when they check for abuse, and with some settings it can even help <b>train</b> future models. So a chatbot is a helpful stranger, not a diary.',
		'[ingat] The billboard test. Before you paste anything, picture it printed on a giant billboard by the road. If you would not post it there, do not paste it into a chatbot.',
		'First message, a question about a public news article. Up on the billboard, nothing private shows. Send it, this is exactly what chatbots are good at.',
		'Second, help polishing a CV. The writing is fine to share, but the phone number and home address are not. <b>Clean it first</b>, swap the private bits out, and the help still works.',
		'Third, a friend told you a secret. That is not your news to put on any billboard, and removing her name does not help when the secret is the whole message. <b>Keep it out</b>.',
		'[fyi] Passwords, bank codes, and secret keys always stay out, no real service will ever ask for them in a chat. Many chatbots also let you switch off training in the settings, which is worth a look.',
		"[fyi] Fairness matters too. Models learned from writing and art made by real people, so asking for a general style like watercolor is fine, but copying one living artist's exact look to sell is where it gets unfair.",
		'If you like, tap a message and run the billboard test on it again. Totally optional.'
	],
	reactions: {
		news: 'Nothing private up there, so off it goes. Just remember the answer can still get details wrong.',
		cv: 'The bot does not need your phone number or address to polish your writing. Your experience goes, your private details stay home.',
		friend:
			"This one never leaves your phone. It is Rina's news to share, not yours, with a bot or with anyone."
	},
	panels: [
		{
			tag: 'Where it goes',
			title: 'Off to the provider',
			body: "A message to a chatbot leaves your device and lands on the <b>provider's servers</b>, far away from you."
		},
		{
			tag: 'Over there',
			title: 'Kept, read, learned from',
			body: 'It may be <b>kept</b> for a while, <b>read</b> by staff who check for abuse, or used to <b>train</b> later models.'
		},
		{
			tag: 'Make it stick',
			title: 'The billboard test',
			body: 'Picture the message on a giant sign by the road. Fine up there means fine to paste.'
		},
		{
			tag: 'Send it',
			title: 'Nothing private',
			body: 'A public article holds no secrets. Ask away, and still double check the facts that matter.'
		},
		{
			tag: 'Clean first',
			title: 'Swap out the private bits',
			body: 'Replace phone numbers, addresses, and names with a placeholder. The bot only needs the part you want help with.'
		},
		{
			tag: 'Keep it out',
			title: 'Not yours to share',
			body: "Someone else's secret stays out of every chat. When the secret is the whole message, cleaning cannot fix it."
		},
		{
			tag: 'Recap',
			title: 'Three choices',
			body: 'Send it, clean it first, or keep it out. Passwords and keys always belong in the last group.'
		},
		{
			tag: 'Try it',
			title: 'Your turn',
			body: 'Tap a message and watch the billboard test run on it again.'
		}
	],
	picture:
		'A big billboard by the road showing a message, a phone that wants to send it, and the chatbot provider at the other end of the line.',
	youLabel: 'you',
	providerLabel: 'chatbot provider',
	fates: ['kept', 'read', 'trained on'],
	billboardAsk: 'Would you put it up here?',
	messages: [
		{
			id: 'news',
			label: 'News article',
			lines: [
				[{ t: 'Can you explain this news article' }],
				[{ t: 'about solar panels in simple words?' }]
			]
		},
		{
			id: 'cv',
			label: 'My CV',
			lines: [
				[{ t: 'Please make my CV sound better.' }],
				[{ t: 'Phone ' }, { t: '0812 3456 7890', secret: true }],
				[{ t: 'Address ' }, { t: 'Jl. Melati 5, Bandung', secret: true }],
				[{ t: 'Skills, design and teamwork.' }]
			]
		},
		{
			id: 'friend',
			label: 'A secret',
			lines: [
				[{ t: 'Rina told me in secret that she', secret: true }],
				[{ t: 'is moving abroad next month.', secret: true }],
				[{ t: 'Write a post telling everyone.' }]
			]
		}
	],
	removed: '[removed]',
	verdicts: { send: 'Send it', clean: 'Clean first', keep: 'Keep it out' },
	rule: 'Not for a billboard, not for a chatbot'
};
