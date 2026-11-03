import type { WhatIsAiText } from './types';

export const en: WhatIsAiText = {
	title: 'What is AI',
	intro: [
		'Picture a calculator. You type 7 times 8 and it says 56. It is not thinking at all. A person wrote the rule for multiplying by hand, and the program just follows it, step by step. That is a <b>normal program</b>.',
		'Sometimes, though, a machine does something that <i>looks</i> smart, like beating you at chess or recognising your face. Every machine like that sits under one big umbrella called <b>AI</b>, short for artificial intelligence.',
		'Inside that umbrella lives <b>machine learning</b>, or <b>ML</b> for short (same thing, ML is just the nickname). Here nobody writes the rules. You show the machine thousands of examples, and it figures out the pattern by itself.',
		'Inside ML lives <b>deep learning</b>. It is machine learning built on a [[neural network|ai/neural-net]], many layers of tiny math pieces stacked on top of each other. Give it enough examples and it gets really good at pictures, voices, and language.',
		'And right in the middle sits <b>generative AI</b>. It does not just recognise things, it <i>creates</i> new ones. Chatbots like ChatGPT that write answers, and apps that paint a picture from one sentence, live here.',
		'[fyi] So every chatbot is AI, but not every AI is a chatbot. When people say "AI" these days they often mean only that smallest ring, while the umbrella is much bigger.',
		'Here are the rings, nested like an onion, with space outside for things that are not AI at all. Tap a card, then tap the ring where it belongs.'
	],
	reactions: {
		calc: 'Yep, not AI at all. A calculator never learns or guesses anything, it only follows the rules a person wrote for it. Handy, but not smart.',
		calc_wrong:
			'Hmm, has a calculator ever learned something new? Every step inside it was written by a person, and it does exactly that, nothing more. Try again.',
		chess:
			'Right, AI but not ML. The bot plays like a clever opponent, yet every rule was typed in by its makers. It never learned from examples, so it stays in the outer ring.',
		chess_wrong:
			'It does look smart, so it belongs somewhere under the umbrella. But did it learn from examples, or did people write every rule by hand? Try another ring.',
		spam: 'Correct, machine learning. Nobody wrote a rule for every scam email. The filter studied millions of emails that people marked as spam and learned the pattern on its own.',
		spam_wrong:
			'Think about where its rules came from. Nobody listed every spam trick, it learned them from piles of examples. It only sorts mail though, it creates nothing, and a simple learner is enough. Try again.',
		price:
			'Nice, machine learning too. Feed it thousands of past house sales (size, location, price) and it learns to guess the price of a house it has never seen.',
		price_wrong:
			'It guesses from old house sales, so it did learn from examples. But it only gives back one number, no giant neural network needed. Try again.',
		face: 'Exactly, deep learning. Faces are way too messy for rules written by hand (the light, the angle, your new haircut). A neural network with many layers learned from millions of face photos instead.',
		face_wrong:
			'Nobody could write rules for every face by hand, so it learned from examples. Faces are messy though, it takes a big neural network with many layers. And it recognises you, it does not draw you. Try again.',
		chat: 'Yes, generative AI! It reads your question and writes a brand new answer word by word, an answer nobody wrote beforehand. That is the creating part.',
		chat_wrong:
			'Is the chatbot only recognising something, or is it making something new? Every answer it writes is fresh. Look for the ring that creates.',
		image:
			'Right, generative AI as well. You type "a cat surfing at sunset" and it paints a picture that never existed before.',
		image_wrong:
			'That picture did not exist anywhere until the app made it. Which ring is all about creating new things?'
	},
	rings: {
		out: 'Not AI',
		ai: 'AI',
		ml: 'Machine learning (ML)',
		dl: 'Deep learning',
		gen: 'Generative AI'
	},
	cards: [
		{ id: 'chat', name: 'Chatbot', sub: 'writes answers for you' },
		{ id: 'calc', name: 'Calculator', sub: 'adds up what you type' },
		{ id: 'face', name: 'Face unlock', sub: 'your phone knows your face' },
		{ id: 'spam', name: 'Spam filter', sub: 'catches junk email' },
		{ id: 'chess', name: 'Chess bot', sub: 'every rule written by hand' },
		{ id: 'image', name: 'Image maker', sub: 'paints from a sentence' },
		{ id: 'price', name: 'House price guesser', sub: 'learns from past sales' }
	],
	pickHint: 'Pick a card to sort',
	ringHint: 'Now tap the ring for {name}',
	doneNote: 'All sorted, every card found its ring'
};
