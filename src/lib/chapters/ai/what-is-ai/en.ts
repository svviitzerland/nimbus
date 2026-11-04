import type { WhatIsAiText } from './types';

export const en: WhatIsAiText = {
	title: 'What is AI',
	intro: [
		'Picture a calculator. You type 7 times 8 and it says 56. It is not thinking at all. A person wrote the rule for multiplying, and the machine just follows it. That is a <b>normal program</b>, so it waits outside our picture.',
		'People dreamed of smarter machines for a long time. In 1950 a British mathematician named <b>Alan Turing</b> asked a famous question, "can machines think?" In 1956 a group of scientists met for a summer workshop about that dream and gave it a name, <b>artificial intelligence</b>.',
		'So <b>AI</b> is the big circle. It holds every machine that does something that <i>looks</i> smart. A chess bot lands here. It plays like a clever opponent, but people typed in every rule it uses.',
		'Inside AI sits <b>machine learning</b>, or <b>ML</b> for short. Here nobody writes the rules. You show the machine lots of examples and it works out the pattern by itself. A spam filter studied millions of emails that people marked as spam, and learned what spam looks like.',
		'[ingat] A normal program gets the rules. Machine learning gets examples and finds the rules itself. Rules in means a program, examples in means ML.',
		'Inside ML sits <b>deep learning</b>. It is machine learning built on a [[neural network|ai/neural-net]], many layers of tiny pieces stacked up. With enough examples it gets really good at messy things like faces, voices, and language. That is how face unlock knows it is you.',
		'Right in the middle sits <b>generative AI</b>. It does not just recognise things, it <i>creates</i> new ones. Chatbots that write answers and apps that paint a picture from one sentence live here.',
		'[ingat] The circles nest like the layers of an onion, and every inner layer is still part of the outer ones. Every chatbot is AI, but not every AI is a chatbot, just like every kitten is a cat but not every cat is a kitten.',
		'Curious why something sits where it does? Tap any example and I will tell you. Totally optional, the circles are already complete.'
	],
	reactions: {
		calc: 'The calculator stays outside. It never learns or guesses anything, it only follows the rules a person wrote. Handy, but not smart.',
		chess:
			'The chess bot is AI, but not ML. It plays cleverly, yet every rule came from its makers. It never learned from examples, so it stays in the outer circle.',
		spam: 'The spam filter is machine learning. Nobody wrote a rule for every scam email, it studied piles of emails people had already sorted and found the pattern on its own.',
		face: 'Face unlock is deep learning. Faces are too messy for rules written by hand (the light, the angle, your new haircut), so a neural network learned from millions of face photos instead.',
		chat: 'The chatbot is generative AI. It writes a brand new answer word by word, an answer nobody wrote beforehand. That is the creating part.',
		image:
			'The image app is generative AI too. You type one sentence and it paints a picture that never existed before.'
	},
	panels: [
		{
			tag: 'Not AI',
			title: 'A normal program',
			body: 'A person writes every rule and the machine follows them exactly. It never learns anything new.'
		},
		{
			tag: 'A bit of history',
			title: 'Can machines think?',
			body: 'Turing asked it in <b>1950</b>. The name <b>artificial intelligence</b> arrived in <b>1956</b>, at a summer workshop of scientists in the United States.'
		},
		{
			tag: 'Circle 1',
			title: 'Artificial intelligence',
			body: 'Any machine that acts smart, like playing chess or planning a route. The smart part can come from rules people wrote by hand.'
		},
		{
			tag: 'Circle 2',
			title: 'Machine learning',
			body: 'A part of AI that learns from <b>examples</b> instead of being told the rules.'
		},
		{
			tag: 'Remember',
			title: 'Rules or examples',
			body: 'Rules in, program. Examples in, machine learning.'
		},
		{
			tag: 'Circle 3',
			title: 'Deep learning',
			body: 'Machine learning that uses a big <b>neural network</b> with many layers. It shines at photos, sound, and text.'
		},
		{
			tag: 'Circle 4',
			title: 'Generative AI',
			body: 'Deep learning that <b>makes</b> new things (text, pictures, music) instead of only sorting what it sees.'
		},
		{
			tag: 'Remember',
			title: 'Circles inside circles',
			body: 'Each circle is part of the one around it. When people say AI today, they often mean only the smallest one.'
		},
		{
			tag: 'Try it',
			title: 'Where does it live?',
			body: 'Tap an example to light up its circle and hear why it belongs there.'
		}
	],
	rings: {
		ai: 'Artificial intelligence',
		ml: 'Machine learning',
		dl: 'Deep learning',
		gen: 'Generative AI'
	},
	things: {
		calc: 'calculator',
		chess: 'chess bot',
		spam: 'spam filter',
		face: 'face unlock',
		chat: 'chatbot',
		image: 'image app'
	},
	quote: 'Can machines think?',
	quoteBy: 'Alan Turing, 1950',
	photo: { alt: 'Photo of Alan Turing as a teenager', caption: 'Alan Turing, about 1928' },
	rule: 'Rules in, program. Examples in, machine learning.',
	nest: 'Every chatbot is AI, not every AI is a chatbot.',
	tapHint: 'Tap any example'
};
