import type { AiApiText } from './types';

export const en: AiApiText = {
	title: 'AI through APIs',
	intro: [
		'Lots of apps now have a chatbot tucked inside. A shop that answers questions, a notes app that summarises for you. But almost none of them run their own AI. They <b>ask someone else</b> over the internet.',
		'They use an [[API|foundations/api]], the same waiter between app and backend you met before. Your app sends a <b>request</b> to an AI provider (a company that runs big models on its own computers) and waits for the answer.',
		'The request carries three things. Which <b>model</b> to use, the <b>message</b> itself, and an <b>API key</b>. The key is a long secret code that tells the provider who is asking, and so who gets the bill.',
		'The answer comes back as <b>JSON</b>, a tidy text format apps read easily, with a label on the left of each line and its value on the right. Inside sits the reply, and also a count of the <b>tokens</b> used, the small pieces of text a model reads and writes ([[LLMs and tokens|ai/llm]]). You pay per token.',
		'[fyi] Same word, different world. A token here is a scrap of text. The token a website hands you after you log in is something else entirely, a digital pass that proves you are signed in ([[sessions and tokens|web/auth]]).',
		'Build a request below. Pick a question and a model, then send it from nimbus.com to the provider. Read what comes back, then switch the model and compare the bill.'
	],
	reactions: {
		model:
			'Bigger model, sharper answers, bigger bill. A small model is cheap and quick, fine for easy jobs. A big one thinks deeper, but every token costs many times more.',
		sent: 'There it is! Look at the usage part of the JSON, the input tokens you sent and the output tokens it wrote. The provider counts every single one, and that becomes the bill under it. Now switch the model and send again.',
		nokey:
			'Rejected with a 401! Without an API key the provider has no idea who is asking, so who would pay? That is why the key is a secret. It lives on your backend, never inside the app people download.',
		compare:
			'See the gap? Same question, very different bill. A fraction of a cent looks like nothing, until ten thousand people ask every day. Picking the right model for each job is a big part of building with AI.'
	},
	locale: 'en-US',
	appLabel: 'nimbus.com',
	appSub: 'your backend',
	providerLabel: 'AI provider',
	providerSub: 'runs the model',
	promptLabel: 'Question',
	prompts: [
		{
			label: 'Short question',
			text: 'What is a VPC?',
			answers: {
				mini: 'A VPC is your own private network inside the cloud. Your servers live there, walled off from everyone else.',
				pro: 'A VPC (virtual private cloud) is a private network you rent inside a cloud provider. You pick its address range, split it into subnets, and use firewall rules to decide what may come in or go out. Your servers live there, walled off from other customers even though they share the same data center.'
			}
		},
		{
			label: 'Translate',
			text: 'Translate this into Indonesian, please. Good morning, the server is back online.',
			answers: {
				mini: 'Selamat pagi, servernya sudah online lagi.',
				pro: 'Selamat pagi, servernya sudah kembali online. For a more formal announcement you could also write, Selamat pagi, server telah kembali beroperasi.'
			}
		},
		{
			label: 'Long email',
			text: 'Write a friendly email to nimbus.com customers saying the site will be down for maintenance on Sunday night.',
			answers: {
				mini: 'Hi there! nimbus.com will be down for maintenance on Sunday night. We will be back before Monday morning. Thanks for your patience!',
				pro: 'Hi there! We wanted to give you a heads up that nimbus.com will be offline on Sunday night while we do some planned maintenance. We are upgrading our servers so everything runs faster and more reliably. The site should be back well before Monday morning, and your data stays safe the whole time. If you have any questions, just reply to this email. Thanks for your patience, and see you on the other side!'
			}
		}
	],
	modelLabel: 'Model',
	modelDesc: { mini: 'small, cheap', pro: 'big, smarter' },
	keyLabel: 'API key',
	keyOn: 'attached',
	keyOff: 'left out',
	sendBtn: 'Send the request',
	sending: 'Waiting for the answer',
	requestTitle: 'Request',
	responseTitle: 'Response',
	responseEmpty: 'Nothing came back yet',
	missingKey: 'missing API key',
	billTitle: 'Bill per request',
	billEmpty: 'Send something to see what it costs',
	tokensIn: '{n} in',
	tokensOut: '{n} out',
	perDay: 'If 10,000 people asked this every day, that is about {cost} a day.',
	priceNote: '{model} charges {in} per 1,000 input tokens and {out} per 1,000 output tokens.'
};
