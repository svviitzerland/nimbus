import type { RagText } from './types';

export const en: RagText = {
	title: 'What is RAG',
	intro: [
		'Ask a chatbot about the nimbus.com refund policy and something funny happens. It answers right away, sounding totally sure. But it has never seen your policy. It learned from the public internet, and your own documents were never part of that.',
		'When an [[LLM|ai/llm]] does not know, it still guesses the most likely next tokens, so it makes up an answer that sounds right. That is called a <b>hallucination</b>, and it is one of the biggest headaches with AI.',
		'The fix has a fancy name, <b>RAG</b> (retrieval augmented generation), but the idea is simple. Before answering, first <b>search</b> your own documents, then paste the best matching piece into the prompt right next to the question.',
		'The search usually runs on [[embeddings|ai/embeddings]]. The question and every document become numbers, and the closest ones win. Then the model answers from the page in front of it, like an open book exam.',
		'[fyi] The best part, when the policy changes you do not retrain anything, you just edit the document. That is why most customer support bots today are built on RAG.',
		'Ask the refund question twice, once with the model alone and once with documents. Then try changing the refund days in the policy and ask again.'
	],
	reactions: {
		plain_refund:
			'Sounds confident, right? But it never read the nimbus.com policy, it just guessed what most sites say. That is a hallucination, a believable answer with nothing behind it.',
		plain_support:
			'A 24 hour hotline? nimbus.com has no phone line at all. The model filled the gap with something that sounds right, and it would happily send a customer to a number that does not exist.',
		rag_refund:
			'This time it searched first, found the Refund policy, and answered from it. See the little source tag? You can check exactly where the answer came from.',
		rag_support:
			'The search picked the Contact page as the closest match, and the answer follows it closely. No made up phone number this time.',
		edit: 'Policy updated. The model alone will never notice, it cannot see this page. Ask again with documents and watch.',
		edit_rag:
			'You changed the document and the answer changed with it, no retraining at all. With RAG, keeping an AI up to date is as easy as editing a page.'
	},
	appTitle: 'nimbus.com help',
	modePlain: 'Model only',
	modeRag: 'With documents',
	askBtn: 'Ask',
	searching: 'Searching the nimbus.com documents',
	you: 'You',
	ai: 'AI',
	source: 'from {doc}',
	noSource: 'no source',
	shelfTitle: 'nimbus.com documents',
	unseen: 'The model alone cannot see these',
	attached: 'attached',
	match: '{n}% match',
	daysLabel: 'Refund window in days',
	fewer: 'Fewer days',
	more: 'More days',
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
			body: 'Chat with us from the bubble in your dashboard, weekdays 9 am to 5 pm. We have no phone line.'
		},
		about: {
			title: 'About nimbus',
			body: 'A small, friendly cloud host run by Nim and friends since 2024.'
		}
	},
	questions: {
		refund: {
			chip: 'Refund after 20 days?',
			ask: 'I paid for nimbus.com hosting 20 days ago. Can I still get a refund?',
			plain:
				'Yes, of course! Most hosting companies offer a 30 day money back guarantee, so you are still covered.',
			rag: 'Sorry, no. nimbus.com only refunds within {days} days of payment. After that, your unused time turns into account credit instead.'
		},
		support: {
			chip: 'How to reach support?',
			ask: 'How do I contact nimbus.com support?',
			plain:
				'Just call their 24 hour hotline, or send an email to their support team and they will reply within a day.',
			rag: 'Open the chat bubble in your nimbus.com dashboard. The team is there on weekdays from 9 am to 5 pm. There is no phone line.'
		}
	},
	refundYes:
		'Yes! nimbus.com refunds within {days} days of payment, and 20 days is still inside that window. You can ask for it from the billing page.'
};
