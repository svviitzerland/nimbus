import type { RagText } from './types';

export const en: RagText = {
	title: 'What is RAG',
	intro: [
		'Here is the nimbus.com help chat. A customer paid for hosting 20 days ago and asks whether they can still get a refund. A chatbot is about to answer.',
		'It answers instantly, sounding totally sure. Yes, 30 days, no problem! But this bot has never seen the nimbus.com refund policy. It learned from the public internet, so it simply said what most websites say.',
		'The real policy says 14 days, so the answer is wrong. When an [[LLM|ai/llm]] does not know something, it still guesses the most likely words and makes up an answer that sounds right. That is called a <b>hallucination</b>.',
		'The fix is called <b>RAG</b>, short for retrieval augmented generation. Fancy name, simple idea. Before answering, the bot first <b>searches</b> your own documents for the piece that best matches the question. The search uses [[embeddings|ai/embeddings]], so it matches by meaning, not by exact words.',
		'How does that search work? First every document is cut into small <b>chunks</b>, a few sentences each. Each chunk becomes an [[embedding|ai/embeddings]], a list of numbers for its meaning, kept in a <b>vector database</b>. The question becomes numbers too, and the database hands back the chunks closest to it.',
		'The best match, the refund policy, gets pasted into the prompt right next to the question. Now the model is not answering from memory anymore. It is reading the page in front of it.',
		'And now the answer is right. Sorry, refunds are only within 14 days. It even shows where the answer came from, so anyone can check.',
		'[ingat] RAG turns a closed book exam into an open book exam. Without it, the AI answers from memory and sometimes makes things up. With it, the AI looks it up first, then answers.',
		'[fyi] The best part is that when the policy changes, you do not retrain anything. You just edit the document. That is why most customer support bots today are built on RAG.',
		'Want to see that happen? Change the refund policy and watch the bot look it up again. Totally optional.'
	],
	reactions: {
		longer:
			'Policy edited to 30 days, and the bot found the new page and changed its answer. No retraining at all, just a different document.',
		shorter:
			'Back to 14 days, and the answer follows right away. With RAG, keeping an AI up to date is as easy as editing a page.'
	},
	panels: [
		{
			tag: 'The question',
			title: 'A customer asks',
			body: 'The help chat on nimbus.com runs on an LLM. The customer wants a fact that only nimbus.com knows.'
		},
		{
			tag: 'From memory',
			title: 'A confident guess',
			body: 'The model answers from what it learned in training. It never saw the nimbus.com documents, so it fills the gap with the usual answer.'
		},
		{
			tag: 'Hallucination',
			title: 'Sounds right, is wrong',
			body: 'A <b>hallucination</b> is a made up answer that sounds believable. The model is not lying on purpose, it simply guesses likely words.'
		},
		{
			tag: 'Retrieve',
			title: 'Look it up first',
			body: 'The question is compared with every document. Each one gets a match score, and the closest in meaning wins.'
		},
		{
			tag: 'Chunks',
			title: 'Cut, turn into numbers, store',
			body: 'Each page is cut into small chunks, and each chunk gets its own embedding. The vector database keeps similar meanings close together, so the chunks nearest the question win.'
		},
		{
			tag: 'Augment',
			title: 'Paste it into the prompt',
			body: 'The winning document goes into the prompt together with the question, so the model can read it.'
		},
		{
			tag: 'Generate',
			title: 'Answer from the page',
			body: 'The model writes its answer from the document in front of it, and points to its source.'
		},
		{
			tag: 'Make it stick',
			title: 'An open book exam',
			body: 'Without RAG the AI takes a closed book exam. With RAG it gets to open the book first.'
		},
		{
			tag: 'Try it',
			title: 'Edit the document',
			body: 'Change the policy and ask again. The bot reads the new page, no retraining needed.'
		}
	],
	picture:
		'A help chat that answers from memory, then looks up the refund policy and answers again',
	appTitle: 'nimbus.com help',
	you: 'Customer',
	ai: 'Help bot',
	question: 'I paid for hosting 20 days ago. Can I still get a refund?',
	wrongAnswer:
		'Yes, of course! Most hosting companies give a 30 day money back guarantee, so you are covered.',
	answerNo:
		'Sorry, not anymore. nimbus.com refunds within {days} days of payment. Your unused time can become account credit instead.',
	answerYes:
		'Yes! nimbus.com refunds within {days} days of payment, and 20 days is still inside that window.',
	fromMemory: 'from memory',
	source: 'from {doc}',
	madeUp: 'Made up',
	shelfTitle: 'nimbus.com documents',
	unseen: 'The bot alone cannot see these',
	searching: 'Searching the documents',
	match: '{n}% match',
	readsTitle: 'What the model reads',
	chunkTitle: 'Documents cut into chunks',
	dbTitle: 'Vector database',
	questionDot: 'question',
	docs: {
		refund: {
			title: 'Refund policy',
			body: 'Full refund within {days} days of payment. After that, unused time becomes account credit.'
		},
		pricing: {
			title: 'Pricing',
			body: 'Hosting starts at Rp 25.000 a month. Pay yearly and get two months free.'
		},
		contact: {
			title: 'Contact us',
			body: 'Chat with us from your dashboard, weekdays 9 am to 5 pm.'
		},
		about: {
			title: 'About nimbus',
			body: 'A small, friendly cloud host run by Nim and friends.'
		}
	},
	closedBook: 'From memory',
	openBook: 'Looked it up',
	rule: 'Closed book guesses, open book checks',
	editBtn: 'Change the policy to {days} days'
};
