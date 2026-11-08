import type { AiEthicsText } from './types';

export const en: AiEthicsText = {
	title: 'AI ethics',
	intro: [
		'Chatbots are handy for all sorts of things. Writing, translating, explaining a tricky homework question. But before you hit send, it helps to know where your message actually goes.',
		'With an online AI service, messages go to the provider’s servers. Storage, staff access, and training use vary by product, contract, and settings. Check the terms of the service you use.',
		"That puts a few things off limits. <b>Passwords</b> and <b>secret keys</b>, other people's <b>private news</b>, and anything your school or office says must stay inside. Often you can still get the help you want, just clean out the private bits first.",
		'Consider other people’s material too. When creating artwork, describe the colors, medium, and composition you want, and respect permissions for reference material.',
		'[fyi] Turning off training use does not automatically mean messages are not stored. Retention and training use are separate settings to check.',
		'[ingat] <b>Purpose, data, permission.</b> Send only what the task needs, check permission to share, and remove unnecessary secrets.',
		'Here are six messages someone is about to send. For each one, decide whether to send it as it is, clean it first, or keep it out of the chatbot.'
	],
	reactions: {
		news: 'This request asks about a public article without including private information. Check the summary against the original article.',
		news_wrong:
			'This example contains no secret that needs removal. You can request an explanation and check it against the source.',
		cv: 'Nice clean up. The bot does not need your phone number or home address to polish your writing. Your experience stays, your private details stay home.',
		cv_wrong:
			'Hmm, the help itself is fine, but look at the phone number and home address. The bot does not need those to improve your CV. Try keeping the useful part and dropping the private bits.',
		key: 'An API key grants access to a service. Replace it with a placeholder before sharing code. If a real key leaks, revoke and replace it.',
		key_wrong:
			"Look closer at that code, there is a secret key in it. Pasted as is, the key now lives on someone else's server. But you do not have to give up the help either, the bug makes sense without the key.",
		friend:
			'Right. This is not your news to share, not with a chatbot and not with a group chat. Removing her name would not fix it either, the whole point of the message is the secret.',
		friend_wrong:
			'Wait, Rina told you that in secret. Sharing it, with a bot or anyone else, is her call, not yours. Cleaning a name out does not help when the secret is the whole message.',
		art: 'The prompt now describes a watercolor medium and the intended visual mood. Describing visual elements makes the direction clearer.',
		art_wrong:
			'Describe the elements you need, such as watercolor, soft colors, or composition, so the direction does not depend on copying a particular creator.',
		bank: "Exactly. No chatbot ever needs your bank password, and no real service will ask you to paste it in a chat. Check transactions inside your bank's own app.",
		bank_wrong:
			'Careful, that is your bank password! Never paste it into a chatbot, even with the name cleaned out the bot has no business holding it. This one stays out completely.',
		done: 'All six cases are complete. Distinguish required information, details to remove, and secrets that need permission before sharing.'
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
	journey: ['Your device', 'Provider servers', 'Retention by service', 'Training under its terms']
};
