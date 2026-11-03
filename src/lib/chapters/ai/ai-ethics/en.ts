import type { AiEthicsText } from './types';

export const en: AiEthicsText = {
	title: 'AI ethics',
	intro: [
		'Chatbots are handy for all sorts of things. Writing, translating, explaining a tricky homework question. But before you hit send, it helps to know where your message actually goes.',
		"What you type travels to the provider's servers ([[AI through APIs|ai/ai-api]]). It is usually <b>stored</b> for a while, it may be read by staff checking for abuse, and with some settings it can even help <b>train</b> future models. So treat a chatbot like a helpful stranger, not a diary.",
		"That puts a few things off limits. <b>Passwords</b> and <b>secret keys</b>, other people's <b>private news</b>, and anything your school or office says must stay inside. Often you can still get the help you want, just clean out the private bits first.",
		"Then there is the question of who owns what AI makes. Models learned from huge piles of writing and art made by real people, and courts around the world are still arguing about what is fair. Copying a living artist's exact style to sell is where it gets touchy.",
		'[fyi] None of this makes AI bad. Many companies run private versions that keep nothing and never train on it, and most chatbots let you switch training off in the settings. Knowing what happens is exactly what lets you use it well.',
		'Here are six messages someone is about to send. For each one, decide whether to send it as it is, clean it first, or keep it out of the chatbot.'
	],
	reactions: {
		news: 'Easy one. A public article holds nothing private, so asking a chatbot to explain it is exactly what it is good at. Just remember it can still get details wrong.',
		news_wrong:
			'You can relax on this one. The article is already public, there is nothing secret in it. Asking the bot to explain it is totally fine.',
		cv: 'Nice clean up. The bot does not need your phone number or home address to polish your writing. Your experience stays, your private details stay home.',
		cv_wrong:
			'Hmm, the help itself is fine, but look at the phone number and home address. The bot does not need those to improve your CV. Try keeping the useful part and dropping the private bits.',
		key: "Good catch. An API key is like a password for your account, and once it sits on someone else's server you can not take it back. The bug is still there to look at, without the secret.",
		key_wrong:
			"Look closer at that code, there is a secret key in it. Pasted as is, the key now lives on someone else's server. But you do not have to give up the help either, the bug makes sense without the key.",
		friend:
			'Right. This is not your news to share, not with a chatbot and not with a group chat. Removing her name would not fix it either, the whole point of the message is the secret.',
		friend_wrong:
			'Wait, Rina told you that in secret. Sharing it, with a bot or anyone else, is her call, not yours. Cleaning a name out does not help when the secret is the whole message.',
		art: "Good thinking. Asking for a style like watercolor is fine, but copying one living artist's look and selling it without them is where AI gets unfair to real creators.",
		art_wrong:
			'This one sits in the middle. Making art of Nim with AI is fine, but copying the exact style of a living artist to sell prints takes from their work. Try asking for a general style instead.',
		bank: "Exactly. No chatbot ever needs your bank password, and no real service will ask you to paste it in a chat. Check transactions inside your bank's own app.",
		bank_wrong:
			'Careful, that is your bank password! Never paste it into a chatbot, even with the name cleaned out the bot has no business holding it. This one stays out completely.',
		done: 'Six for six! The rule of thumb is simple. If you would not shout it across a cafe, do not paste it into a chatbot. Clean out what is private, give credit to real creators, and AI becomes a great helper.'
	},
	choices: { send: 'Send as is', clean: 'Clean it first', keep: 'Keep it out' },
	cases: [
		{
			id: 'news',
			context: 'Homework help',
			draft: 'Explain this public news article about the new train line in simple words.',
			secrets: [],
			cleaned: ''
		},
		{
			id: 'cv',
			context: 'Your own CV',
			draft:
				'Make my CV sound more professional. Budi Santoso, phone 0812 3456 7890, Jl. Melati 12 Bandung. Two years as a junior web developer at nimbus.com.',
			secrets: ['phone 0812 3456 7890', 'Jl. Melati 12 Bandung'],
			cleaned:
				'Make my CV sound more professional. Budi Santoso, [phone removed], [address removed]. Two years as a junior web developer at nimbus.com.'
		},
		{
			id: 'key',
			context: 'Your hobby project',
			draft: "Why does this crash? const API_KEY = 'sk_nimbus_8f3a91c2'; fetch(url, API_KEY)",
			secrets: ["'sk_nimbus_8f3a91c2'"],
			cleaned: "Why does this crash? const API_KEY = '[key removed]'; fetch(url, API_KEY)"
		},
		{
			id: 'friend',
			context: "A friend's secret",
			draft:
				'My friend Rina told me in secret that she is pregnant. Write a fun message announcing it to our group chat.',
			secrets: ['told me in secret that she is pregnant'],
			cleaned: ''
		},
		{
			id: 'art',
			context: 'Prints to sell',
			draft:
				'Draw Nim in the exact style of my favourite living illustrator, so I can sell the prints.',
			secrets: ['in the exact style of my favourite living illustrator'],
			cleaned: 'Draw Nim in a soft watercolor style, so I can sell the prints.'
		},
		{
			id: 'bank',
			context: 'Your bank account',
			draft:
				'Here is my bank login, username budi88 and password Melati!2024. Check my last transactions for anything weird.',
			secrets: ['username budi88', 'password Melati!2024'],
			cleaned: ''
		}
	],
	composerLabel: 'Message to the chatbot',
	progress: '{n} of {total}',
	nextBtn: 'Next message',
	finishBtn: 'Wrap it up',
	sentTag: 'sent',
	cleanedTag: 'cleaned, then sent',
	keptTag: 'kept out',
	doneNote: 'All six decided',
	journey: ['Your device', 'Provider servers', 'Stored a while', 'Maybe training']
};
