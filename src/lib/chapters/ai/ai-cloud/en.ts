import type { AiCloudText } from './types';

export const en: AiCloudText = {
	title: 'AI in the cloud',
	intro: [
		'Say nimbus.com adds a little chatbot that helps customers. At first only a handful of people use it, and one server answers them all easily.',
		'That server is a special one. Big models run on a <b>GPU</b> ([[GPUs for AI|ai/gpu]]), a chip that does thousands of small sums at the same time. GPU servers are pricey, and in the cloud you rent them <b>by the hour</b>, every hour, even at night.',
		'Then a video about the chatbot goes viral. More people means more messages, and more messages need more GPU servers, the same way [[auto scaling|traffic/auto-scaling]] adds servers when traffic climbs.',
		'Now look at the [[cloud bill|compute/cost]]. Eight GPU servers running all month, and the bill lands far past the budget. Nimbus cannot keep paying that.',
		'First trick, a <b>cache</b>. Loads of people ask the very same things, like where is my order or how do I reset my password. Those answers are saved once and handed out again, so the model does not have to think twice, and fewer GPUs are needed.',
		'Second trick, a <b>smaller model</b>. It is much cheaper to run, though not as clever. So the small model takes the easy questions and only the hard ones go to the big model. Luckily, most questions are easy.',
		'[ingat] You do not hire a professor to tell people your opening hours. Save the answers people ask again and again, and use the smallest model that still does the job well.',
		'[fyi] If you call a model through an [[API|ai/ai-api]] instead, you pay per token and the provider worries about the GPUs. Renting your own starts to make sense once you are big, or when your data has to stay on your own servers.',
		'If you like, switch the tricks off and on again, and watch the bill jump. Totally optional.'
	],
	reactions: {
		off: 'Tricks off, and every single message goes to the big model again. Eight GPU servers, and the bill shoots past the budget.',
		on: 'Tricks back on. Same crowd, same good answers, and the bill drops well under the budget. That is exactly what real AI teams do.'
	},
	panels: [
		{
			tag: 'The start',
			title: 'A small chatbot',
			body: 'A few people chat each day, and one GPU server running the model answers them all.'
		},
		{
			tag: 'GPU',
			title: 'Rented by the hour',
			body: 'A <b>GPU server</b> is a computer built for the huge piles of sums a model needs. The cloud charges for every hour it is switched on.'
		},
		{
			tag: 'Going viral',
			title: 'More people, more servers',
			body: 'Each server can only answer so many messages at once, so a bigger crowd means renting more of them.'
		},
		{
			tag: 'The bill',
			title: 'Over budget',
			body: 'The <b>budget</b> is what nimbus can afford each month. Eight servers around the clock goes far past it.'
		},
		{
			tag: 'Trick 1',
			title: 'The cache',
			body: 'A <b>cache</b> keeps answers to common questions. A repeat question is answered from it, and the model never sees it.'
		},
		{
			tag: 'Trick 2',
			title: 'A smaller model',
			body: 'A <b>small model</b> needs a cheaper GPU. Easy questions go to it, and the big model only gets the hard ones.'
		},
		{
			tag: 'Make it stick',
			title: 'No professor for easy questions',
			body: 'Answer repeats from the cache, send easy questions to the small model, and save the big one for what truly needs it.'
		},
		{
			tag: 'Try it',
			title: 'Tricks on or off',
			body: 'Same crowd either way. Only the tricks change, and the bill follows them.'
		}
	],
	picture:
		'A crowd of people sending messages to a row of GPU servers, a cache that answers repeat questions, and a monthly bill bar with a budget line.',
	locale: 'en-US',
	crowd: 'about {n} people a day',
	gpus: '{n} GPU servers',
	hourly: '{cost} an hour',
	bigLabel: 'big model',
	smallLabel: 'small model',
	cacheLabel: 'cache',
	billTitle: 'Monthly bill',
	budgetLabel: 'budget',
	memo: 'no professor needed',
	rule: 'Cache the common answers, use a smaller model',
	offBtn: 'Switch the tricks off',
	onBtn: 'Switch the tricks back on'
};
