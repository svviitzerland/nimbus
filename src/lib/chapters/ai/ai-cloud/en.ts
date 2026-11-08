import type { AiCloudText } from './types';

export const en: AiCloudText = {
	title: 'AI in the cloud',
	intro: [
		'Say nimbus.com adds a little chatbot that helps customers. At first only a handful of people use it. Then a video about it goes viral, and suddenly everyone wants to chat.',
		'Every answer needs a model running somewhere, and big models run on a <b>GPU</b> ([[GPUs for AI|ai/gpu]]), a chip that does thousands of small sums at the same time. GPU servers are pricey, and in the cloud you rent them <b>by the hour</b>.',
		'More people means more messages, and more messages means more GPU servers, the same way [[auto scaling|traffic/auto-scaling]] adds servers when traffic climbs. Every extra server shows up on the [[cloud bill|compute/cost]] at the end of the month.',
		'Luckily there are tricks. A <b>cache</b> keeps answers to questions people ask again and again, so the model does not have to think twice. And a <b>smaller model</b> is far cheaper to run, though not as clever.',
		'[fyi] If you call a model through an [[API|ai/ai-api]] instead, you pay per token and the provider worries about the GPUs. Renting your own starts to make sense once you are big, or when your data has to stay on your own servers.',
		'[ingat] Choose a model based on required quality and usage cost. Caching can reduce repeated requests when the saved result remains suitable.',
		'Slide the crowd all the way up and watch the bill. Then use the tricks to bring it back under budget, without the answers getting worse.'
	],
	reactions: {
		grow: 'More people, more GPU servers. Each little rack is one GPU server rented by the hour, and the bill climbs with every one of them.',
		budget:
			'Whoa, way past the budget! Nimbus can not pay that every month. Time to try the tricks.',
		cache:
			'Cache on! Loads of people ask the same things (where is my order, how do I reset my password), so those answers come straight from storage. Fewer messages reach the model, so fewer GPUs.',
		small:
			'Super cheap, but look at the quality. The small model gets tricky questions wrong, and customers notice fast. Cheap is no good if the answers are bad.',
		route:
			'Clever. The small model takes the easy questions and only the hard ones go to the big model. Most questions are easy, so most of the work just got cheap.',
		fixed:
			'Under budget with good answers, at a hundred thousand people a day! That is exactly what real AI teams do, cache what repeats and use the smallest model that still does the job well.'
	},
	locale: 'en-US',
	usersLabel: 'People chatting each day',
	usersValue: '{n} people',
	msgsValue: '{n} messages a day',
	cachedValue: '{n} answered from the cache',
	cacheLabel: 'Cache',
	cacheSub: 'reuse answers to repeat questions',
	modeLabel: 'Which model answers',
	modes: {
		big: { name: 'Big model', sub: 'for everything' },
		small: { name: 'Small model', sub: 'for everything' },
		route: { name: 'Small first', sub: 'big only for hard ones' }
	},
	gpuTitle: '{n} GPU servers rented',
	legendBig: 'big model',
	legendSmall: 'small model',
	billLabel: 'Monthly bill',
	budgetMark: 'budget {cost}',
	overBy: '{cost} over budget',
	underBy: '{cost} under budget',
	qualityLabel: 'Answer quality',
	qualityBad: 'too many wrong answers',
	rentNote: 'One GPU server rents for about {hour} an hour, which is {month} a month.'
};
