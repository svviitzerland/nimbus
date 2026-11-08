import type { WhatIsAiText } from './types';

export const en: WhatIsAiText = {
	title: 'What is AI',
	intro: [
		'Picture a calculator. You type 7 times 8 and it says 56. It is not thinking at all. A person wrote the rule for multiplying by hand, and the program just follows it, step by step. That is a <b>normal program</b>.',
		'Sometimes, though, a machine does something that <i>looks</i> smart, like beating you at chess or recognising your face. Every machine like that sits under one big umbrella called <b>AI</b>, short for artificial intelligence.',
		'<b>Machine learning</b>, or ML, is part of AI that learns patterns from data. Developers write the training algorithm, then training adjusts model parameters using examples.',
		'<b>Deep learning</b> uses [[neural networks|ai/neural-net]] with many layers. It is used for tasks including image recognition, speech, and language processing.',
		'And right in the middle sits <b>generative AI</b>. It does not just recognise things, it <i>creates</i> new ones. Chatbots like ChatGPT that write answers, and apps that paint a picture from one sentence, live here.',
		'[fyi] A chatbot is a conversational interface. Some use fixed rules, while others use generative models. Appearance alone does not tell you the method behind it.',
		'[ingat] In a rule-based program, people write the rules. In machine learning, training adjusts a model using data.',
		'Here are the rings, nested like an onion, with space outside for things that are not AI at all. Tap a card, then tap the ring where it belongs.'
	],
	reactions: {
		calc: 'This calculator follows programmed arithmetic rules. It does not train a model from data.',
		calc_wrong:
			'Hmm, has a calculator ever learned something new? Every step inside it was written by a person, and it does exactly that, nothing more. Try again.',
		chess:
			'The chess bot on this card uses search and programmed evaluation rules. This is AI without machine learning. Other chess programs may use ML.',
		chess_wrong:
			'It does look smart, so it belongs somewhere under the umbrella. But did it learn from examples, or did people write every rule by hand? Try another ring.',
		spam: 'This filter is trained on emails labeled spam or not spam. Its parameters learn to distinguish the two.',
		spam_wrong:
			'Think about where its rules came from. Nobody listed every spam trick, it learned them from piles of examples. It only sorts mail though, it creates nothing, and a simple learner is enough. Try again.',
		price:
			'This is machine learning. The model learns from sales data including area, location, and price to estimate prices for other homes.',
		price_wrong:
			'It guesses from old house sales, so it did learn from examples. But it only gives back one number, no giant neural network needed. Try again.',
		face: 'Exactly, deep learning. Faces are way too messy for rules written by hand (the light, the angle, your new haircut). A neural network with many layers learned from millions of face photos instead.',
		face_wrong:
			'Nobody could write rules for every face by hand, so it learned from examples. Faces are messy though, it takes a big neural network with many layers. And it recognises you, it does not draw you. Try again.',
		chat: 'The chatbot on this card uses a generative model to produce answer tokens from context. Its output still needs checking.',
		chat_wrong:
			'Read the card description. This bot uses a generative model, rather than selecting a fixed reply.',
		image:
			'The generative model produces an image from the prompt. Its output may resemble patterns in training data.',
		image_wrong: 'This card describes a model that generates images. Choose generative AI.'
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
