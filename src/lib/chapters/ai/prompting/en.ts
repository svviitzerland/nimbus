import type { PromptingText } from './types';

export const en: PromptingText = {
	title: 'Prompting',
	intro: [
		'A <b>prompt</b> is simply the message you send to an AI. "Fix my email", "explain DNS like I am five", anything you type into the chat box. Same AI, but how you ask changes the answer a lot.',
		'Remember how an [[LLM|ai/llm]] works? It only guesses the next tokens from what you wrote. It cannot read your mind, so everything you leave out gets filled with the most average guess.',
		'So a good prompt is like briefing a new freelancer. Say the <b>task</b> clearly, give <b>context</b> (who it is for and why), describe the <b>format</b> you want, and if you can, show an <b>example</b>.',
		'[fyi] Same word, different world. In a terminal, the "prompt" is the little $ sign waiting for your command. Different thing, but the same idea, a place where the computer waits for your words.',
		'Here is today\'s job. nimbus.com is running a 50 percent off hosting promo, and you need an Instagram caption. In your head you know exactly what you want, but your prompt only says "Write a caption."',
		'Send it as it is first. Then tap the ingredients to add them to your prompt, and send again until the answer ticks all four wishes.'
	],
	reactions: {
		vague:
			'See that? Sunshine and good vibes, and not one word about nimbus.com. The AI did nothing wrong, it simply had no clue what you meant, so it wrote the most average caption on earth.',
		miss_task:
			'Still generic. The AI does not know what the caption is about. Spell out the actual task, the promo, the 50 percent, and nimbus.com.',
		miss_audience:
			'Better, it is about the promo now, but it talks to nobody in particular. Say who will read it, and the words bend to fit them.',
		miss_format:
			'The content is right, but look at that length and the pile of hashtags. If you do not say the shape you want, the AI guesses, and it usually guesses long.',
		miss_example:
			'So close! Short and on point, but it does not sound like nimbus. One example of an old caption teaches the style faster than any description could.',
		perfect:
			'All four wishes ticked! Same AI the whole time, only your prompt changed. Clear task, context, format, and an example, that is prompting in a nutshell.'
	},
	goalTitle: 'What you really want',
	goal: 'A caption for the nimbus.com 50% hosting promo',
	wishes: {
		task: 'About the promo',
		audience: 'Speaks to students',
		format: 'Short, one hashtag',
		example: 'Sounds like nimbus'
	},
	ingredients: {
		task: {
			chip: 'Task',
			line: 'Write an Instagram caption for the 50% off hosting promo on nimbus.com.'
		},
		audience: {
			chip: 'Context',
			line: 'The readers are students who need a cheap home for their college projects.'
		},
		format: {
			chip: 'Format',
			line: 'Keep it to three short lines and use only one hashtag.'
		},
		example: {
			chip: 'Example',
			line: 'A caption we loved before, "Your site, our cloud, zero stress. Salam awan, the nimbus team."'
		}
	},
	basePrompt: 'Write a caption.',
	promptLabel: 'Your prompt',
	addHint: 'Tap an ingredient to add it, tap again to take it out',
	sendBtn: 'Send prompt',
	you: 'You',
	ai: 'AI',
	score: '{n} of 4 wishes',
	answer: {
		openVague: 'Life is better with a little sunshine!',
		openTask: 'Big news from nimbus.com!',
		openAudience: 'Got a college project that needs a home online?',
		bodyVague: 'Enjoy every moment and keep smiling.',
		bodyTask: 'Hosting is now 50% off, so your site can go live for the price of a coffee.',
		ramble:
			'Whether you are building something big or just starting out, there is always something new to discover, so stay curious, keep learning, and never stop chasing your dreams every single day.',
		signoff: 'Salam awan, the nimbus team.',
		tagsVague: '#happy #life #goodvibes #sunshine #mood #blessed',
		tagsMany: '#hosting #sale #promo #web #cloud #tech #deal #website',
		tagsOne: '#nimbus'
	}
};
