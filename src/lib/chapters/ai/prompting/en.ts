import type { PromptingText } from './types';

export const en: PromptingText = {
	title: 'Prompting',
	intro: [
		'A <b>prompt</b> is simply the message you send to an AI. Today nimbus.com is running a 50 percent off hosting promo, and you ask an AI for an Instagram caption. You type the first thing that comes to mind.',
		'Look at the answer. Sunshine and good vibes, and not one word about nimbus.com. Remember, an [[LLM|ai/llm]] only guesses the next words from what you wrote. It cannot read your mind, so every gap gets filled with the most average guess.',
		'So let us fix the prompt one piece at a time. First the <b>task</b>, say exactly what to write and what it is about. Watch the answer find the promo.',
		'Next, the <b>context</b>. Who will read it, and why? Our readers are students with college projects, so now the caption talks to them.',
		'Then the <b>format</b>, the shape you want back. Three short lines and only one hashtag. No more rambling, no pile of hashtags.',
		'Last, an <b>example</b>. One old caption you loved teaches the style faster than any description. Now it sounds like nimbus. Same AI the whole time, only the prompt changed.',
		'[ingat] Write a prompt like a brief for a new intern on day one. Smart, but knows nothing about you. Give them the task, the context, the format, and show an example. If the intern would still have to ask you something, your prompt is missing a piece.',
		'[fyi] Same word, different world. In a terminal, the "prompt" is the little $ sign waiting for your command. Different thing, same idea, a place where the computer waits for your words.',
		'If you like, tap any line of the prompt to take it out (tap again to put it back) and watch the answer slip. Totally optional.'
	],
	reactions: {
		off_task:
			'Without the task, the AI is back to guessing what the caption is even about. The promo vanished.',
		off_context:
			'Without the context, it stops talking to students and goes back to talking to everyone, which means nobody in particular.',
		off_format:
			'Without the format, look at it ramble, and the hashtags pile up again. When you do not say the shape, the AI guesses long.',
		off_example:
			'Without the example, it is still correct, but it lost the nimbus voice. One example teaches style faster than any description.',
		back: 'Back in, and the answer picks it up straight away.',
		full: 'All four are back. Task, context, format, example, and the caption is spot on again.'
	},
	panels: [
		{
			tag: 'Prompt',
			title: 'The message you send',
			body: 'Whatever you type into the chat box is the <b>prompt</b>. It is the only thing the AI knows about what you want.'
		},
		{
			tag: 'The gaps',
			title: 'Missing means guessed',
			body: 'Every question the prompt leaves open, the AI answers for you with the most common guess. That is why vague prompts get bland answers.'
		},
		{
			tag: 'Task',
			title: 'Say what to make',
			body: 'Name the job and the topic. A caption, for Instagram, about the 50% hosting promo on nimbus.com.'
		},
		{
			tag: 'Context',
			title: 'Say who it is for',
			body: 'Tell it who will read the answer and why. The words bend to fit the reader.'
		},
		{
			tag: 'Format',
			title: 'Say the shape',
			body: 'Length, number of lines, bullet points or not, how many hashtags. If you do not say it, the AI picks, and it usually picks long.'
		},
		{
			tag: 'Example',
			title: 'Show, do not just tell',
			body: 'One sample of what you like teaches the tone better than a paragraph of description.'
		},
		{
			tag: 'Remember it',
			title: 'Brief a new intern',
			body: 'Task, context, format, example. If a new intern would still need to ask you a question, add the missing piece.'
		},
		{
			tag: 'Try it',
			title: 'Take a piece out',
			body: 'Tap a line in the prompt to drop it or bring it back. The answer follows the prompt every time.'
		}
	],
	picture: 'A chat with an AI where the prompt grows and the answer gets better',
	appTitle: 'AI chat',
	you: 'You',
	ai: 'AI',
	basePrompt: 'Write a caption.',
	ingredients: {
		task: {
			chip: 'Task',
			line: 'Write an Instagram caption for the 50% off hosting promo on nimbus.com.',
			question: 'About what?'
		},
		context: {
			chip: 'Context',
			line: 'The readers are students who need a cheap home for their college projects.',
			question: 'For whom?'
		},
		format: {
			chip: 'Format',
			line: 'Keep it to three short lines with only one hashtag.',
			question: 'How long?'
		},
		example: {
			chip: 'Example',
			line: 'A caption we loved before, "Your site, our cloud, zero stress. Salam awan, the nimbus team."',
			question: 'What style?'
		}
	},
	answer: {
		openVague: 'Life is better with a little sunshine!',
		openTask: 'Big news from nimbus.com!',
		openContext: 'Got a college project that needs a home online?',
		openStyle: 'Your project, our cloud, half the price.',
		bodyVague: 'Enjoy every moment and keep smiling.',
		bodyTask: 'Hosting is now 50% off, so your site can go live for the price of a coffee.',
		bodyContext: 'Student hosting on nimbus.com is now 50% off, cheaper than one coffee a month.',
		ramble:
			'Whether you are building something big or just starting out, there is always something new to discover, so stay curious, keep learning, and never stop chasing your dreams every single day.',
		signoff: 'Salam awan, the nimbus team.',
		tagsVague: '#happy #life #goodvibes #sunshine #mood #blessed',
		tagsMany: '#hosting #sale #promo #web #cloud #tech #deal #website',
		tagsOne: '#nimbus'
	},
	grades: ['Too vague', 'Getting there', 'Spot on'],
	rule: 'Task, context, format, example',
	tryHint: 'Tap a line to take it out'
};
