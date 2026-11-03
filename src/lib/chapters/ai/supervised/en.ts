import type { SupervisedText } from './types';

export const en: SupervisedText = {
	title: 'Supervised and unsupervised',
	intro: [
		'So far every example came with its answer attached, this photo is a cat, that house cost this much. Learning from labelled examples is called <b>supervised learning</b>, as if a teacher sat next to the machine holding the answer key.',
		'But labels are expensive. Someone has to tag every single thing by hand, and often there are millions of them. Very often you have a mountain of data and no answers at all.',
		'That is where <b>unsupervised learning</b> comes in. With no labels, the machine looks for things that sit close together and puts them into <b>groups</b> by itself (this is called <b>clustering</b>). It cannot name the groups, it only knows they belong together.',
		'Music apps use both. Songs that people tagged (chill, dance, rock) teach a supervised model to tag new songs (that is [[classification|ai/predict]] again). Clustering finds listeners with a similar taste, without anyone saying who is similar to whom.',
		'[fyi] There is a third style called <b>reinforcement learning</b>. No labels and no groups, just a reward when it does well, a bit like teaching a dog with treats. That is how a computer learned to beat the world champion at the board game Go.',
		'Here is one pile of songs, placed by tempo and energy. With labels on, drop a new song and see how it gets tagged. Then switch the labels off and let the machine find the groups on its own.'
	],
	reactions: {
		sup_guess:
			'Tagged! The new song looked at its three closest neighbours and took their most common tag. It only knows these genre names because people labelled the examples first.',
		unsup_mode:
			'Same songs, but the labels are gone, now the machine only sees dots. Pick how many groups to look for, then press the button.',
		unsup_go:
			'Watch the rings. Each one grabs the songs closest to it, then slides to the middle of its group. It repeats that until nothing changes anymore.',
		found3:
			'Three groups, and they match the chill, dance, and rock songs, even though nobody told it those words. It just calls them group 1, 2, and 3, so a person still has to name them.',
		foundk:
			'It found the number of groups you asked for, but they do not line up with how people tag music. Unsupervised learning always finds some grouping, and it is up to us to judge if it makes sense. Try three.'
	},
	modeSup: 'With labels',
	modeUnsup: 'Without labels',
	genres: ['chill', 'dance', 'rock'],
	xAxis: 'Tempo, slow to fast',
	yAxis: 'Energy, calm to loud',
	supHint: 'Tap the chart to drop in a new song',
	supAnswer: 'Its three closest songs say {label}',
	newSong: 'New song',
	unsupHint: 'Nobody tagged these songs',
	groups: 'Groups',
	findBtn: 'Find groups',
	round: 'Looking, round {n}',
	found: 'Settled on {k} groups after {n} rounds',
	groupName: 'Group {n}',
	reset: 'Reset'
};
