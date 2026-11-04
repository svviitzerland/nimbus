import type { AiApiText } from './types';

export const en: AiApiText = {
	title: 'AI through APIs',
	intro: [
		'Lots of apps now have a chatbot tucked inside. Here is the nimbus app, and someone just asked it a question. But the app has no AI of its own. It is going to <b>ask someone else</b> over the internet.',
		'That someone is an <b>AI provider</b>, a company that runs huge models on its own big computers. Your app talks to it through an [[API|foundations/api]], the same waiter between app and kitchen you met before.',
		'The app packs a <b>request</b>, a bit like an envelope. Inside go two things, which <b>model</b> should answer and the <b>message</b> itself. Then off it goes.',
		'On the envelope sits an <b>API key</b>, a long secret code. It tells the provider who is asking, and so who gets the bill. That is why the key stays hidden on your own server, never inside the app people download.',
		'The model does not read whole sentences at once. It chops text into <b>tokens</b>, small pieces that are often a short word or part of a longer one ([[LLMs and tokens|ai/llm]]). This little question is only six tokens.',
		'The answer comes back as <b>JSON</b>, a tidy text format apps read easily, with a name on the left of each line and its value on the right. Inside sits the reply, plus a count of the tokens that went in and the tokens the model wrote.',
		'Those counts are your bill. The provider charges a tiny price for every token in and every token out. One short question costs a small fraction of a cent.',
		'[ingat] An AI API is a taxi meter. It ticks for every token, the question you send and the answer you get back. A longer trip means a bigger fare.',
		'[fyi] Same word, different world. A token here is a scrap of text. The token a website hands you after you log in is something else, a digital pass that proves you are signed in ([[sessions and tokens|web/auth]]).',
		'If you like, ask for a long answer instead and watch the meter run. Totally optional.'
	],
	reactions: {
		long: 'Look at that meter go! The question only grew a little, but the answer grew a lot, and every one of those words is a token on the bill. Ten thousand people asking for long answers each day adds up fast.',
		short:
			'Back to the short one. Short question, short answer, tiny fare. Asking the model to keep things brief is one of the easiest ways to save money.'
	},
	panels: [
		{
			tag: 'The app',
			title: 'A question in the app',
			body: 'The chat lives inside the nimbus app, but the thinking will happen somewhere else.'
		},
		{
			tag: 'Provider',
			title: 'The AI provider',
			body: 'A company that keeps big models running on its own machines and lets other apps use them through an <b>API</b>.'
		},
		{
			tag: 'Request',
			title: 'Packing the request',
			body: 'The request names the <b>model</b> to use and carries the <b>message</b>. It travels over the internet to the provider.'
		},
		{
			tag: 'API key',
			title: 'Who is asking',
			body: 'The <b>key</b> works like a password for your account. Whoever holds it can spend your money, so it never goes in the app itself.'
		},
		{
			tag: 'Tokens',
			title: 'Text in small pieces',
			body: 'The model reads and writes <b>tokens</b>. A short word is often one token, and a long or rare word gets split into a few.'
		},
		{
			tag: 'Response',
			title: 'JSON comes back',
			body: 'The <b>reply</b> goes back to the app, and the <b>usage</b> part says how many tokens went in and came out.'
		},
		{
			tag: 'The bill',
			title: 'Paying per token',
			body: 'Tokens in plus tokens out, times a tiny price each. That is the whole bill for one question.'
		},
		{
			tag: 'Remember',
			title: 'A taxi meter',
			body: 'More text in either direction means a longer ride. Short questions and short answers keep the fare low.'
		},
		{
			tag: 'Try it',
			title: 'Short or long',
			body: 'Same app, same model, same price per token. Only the length changes, and the meter follows it.'
		}
	],
	picture:
		'The nimbus app on a phone sends a request over the internet to an AI provider, a JSON response comes back, and a taxi meter counts the tokens.',
	appName: 'nimbus',
	appLabel: 'your app',
	providerLabel: 'AI provider',
	modelLabel: 'model',
	requestTitle: 'Request',
	responseTitle: 'Response',
	tokensTitle: 'How the model reads it',
	short: {
		question: 'What is a VPC?',
		reply:
			'A VPC is your own private network inside the cloud. Your servers live there, walled off from everyone else.',
		tokensIn: 6,
		tokensOut: 24
	},
	long: {
		question: 'Explain a VPC in detail, with examples.',
		reply:
			'Sure! A VPC, or virtual private cloud, is a private network you rent inside a cloud provider. You choose its address range, split it into subnets, and use firewall rules to decide what may come in or go out. For example, a shop could keep its web servers in a public subnet and its database in a private one...',
		tokensIn: 10,
		tokensOut: 400
	},
	tokenChips: ['What', 'is', 'a', 'V', 'PC', '?'],
	tokensCount: '{n} tokens in',
	meterTitle: 'token meter',
	meterTokens: '{n} tokens',
	memo: 'like a taxi',
	perDay: 'If 10,000 people asked this every day, that is about {cost} a day.',
	rule: 'Every token ticks the meter',
	longBtn: 'Ask for a long answer',
	shortBtn: 'Back to the short one'
};
