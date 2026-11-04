import type { SupervisedText } from './types';

export const en: SupervisedText = {
	title: 'Supervised and unsupervised',
	intro: [
		'So far every example came with its answer attached, this photo is a cat, that house cost this much. Learning like that is called <b>supervised learning</b>, as if a teacher sat next to the machine holding the answer key. Here are songs that people already tagged as chill, dance, or rock.',
		'A new song arrives. The model looks at the three songs closest to it, takes their most common tag, and labels the newcomer. That is [[classification|ai/predict]] again, and it only works because people tagged the examples first.',
		'But labels are expensive. Someone has to tag every single thing by hand, and often there are millions of them. Very often you have a mountain of data and no answers at all. Watch the tags disappear.',
		'That is where <b>unsupervised learning</b> comes in. With no labels, the machine looks for things that sit close together. Three markers drop in, each one grabs the songs nearest to it, then slides to the middle of its group, again and again until nothing moves. This is called <b>clustering</b>.',
		'Look, three neat groups. But the machine has no idea what to call them. It only knows they belong together, so a person still has to look and say, oh, these must be the chill songs.',
		'[ingat] Supervised has the answer key, unsupervised does not. Think of a quiz with the answers at the back of the book, versus a pile of clean socks you pair up without anyone telling you how.',
		'[fyi] There is a third style called <b>reinforcement learning</b>. No labels and no groups, just a reward when it does well, a bit like teaching a dog with treats. Rewards like that helped a computer beat one of the best Go players in the world in 2016.',
		'If you like, shuffle the markers and let the machine group the songs again from a new start. Totally optional.'
	],
	reactions: {
		again:
			'New starting spots, and the markers still settled on the same three groups. Those songs really do sit together, so the grouping keeps coming back. Music apps use the same trick to find listeners with a similar taste.'
	},
	panels: [
		{
			tag: 'Supervised',
			title: 'Examples with answers',
			body: 'Each song is placed by its tempo and its energy, and a person gave it a tag. The tags are the <b>answer key</b>.'
		},
		{
			tag: 'Supervised',
			title: 'Ask the neighbours',
			body: 'A new song takes the most common tag among its closest songs. It can only use names that people taught it.'
		},
		{
			tag: 'The problem',
			title: 'Labels cost time',
			body: 'Tagging by hand is slow and expensive. Most data in the world has no labels at all.'
		},
		{
			tag: 'Unsupervised',
			title: 'Clustering',
			body: 'No answer key. The markers grab their nearest songs and move to the middle, over and over, until the groups stop changing.'
		},
		{
			tag: 'Unsupervised',
			title: 'Groups without names',
			body: 'The machine finds the groups, but calls them group 1, 2, and 3. A person decides what they mean.'
		},
		{
			tag: 'Remember',
			title: 'Answer key or not',
			body: 'With the answer key, supervised. Without it, unsupervised.'
		},
		{
			tag: 'By the way',
			title: 'A third style',
			body: '<b>Reinforcement learning</b> learns by trying things and collecting rewards, like a game score that goes up.'
		},
		{
			tag: 'Try it',
			title: 'A new start',
			body: 'Shuffle the markers and watch the songs get grouped again.'
		}
	],
	genres: ['chill', 'dance', 'rock'],
	xAxis: 'tempo',
	yAxis: 'energy',
	withKey: 'with answer key',
	withoutKey: 'no answer key',
	tagged: 'Tagged {label}',
	groupName: 'group {n}',
	rule: 'Answer key, supervised. No answer key, unsupervised.',
	againBtn: 'Shuffle and group again'
};
