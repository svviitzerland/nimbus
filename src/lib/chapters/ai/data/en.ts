import type { DataText } from './types';

export const en: DataText = {
	title: 'Data and datasets',
	intro: [
		'Every AI you have ever met learned from a pile of examples. A spam filter studied old emails, face unlock studied photos of faces. Those examples are called <b>data</b>.',
		'When the examples are gathered in one place, ready for learning, we call the collection a <b>dataset</b>. Picture a folder of thousands of photos, each with a short note saying what is in it. That note is called a <b>label</b>.',
		'Here is the catch. A <b>model</b> (the program that does the learning) believes every example completely. If someone labels a dog as a cat, the model happily learns that this dog face is a cat face. People call it <b>garbage in, garbage out</b>.',
		'[fyi] A dataset is not the same thing as a [[database|resilience/database]]. A database holds live data an app uses all day, while a dataset is a frozen collection put together just for learning (often exported from a database, funnily enough).',
		'Real datasets are messy. Some labels are wrong because a tired person clicked too fast, some photos are blurry, some appear twice. Cleaning data is a huge part of real AI work, often bigger than building the model itself.',
		'[ingat] Incorrect or unrepresentative data can produce poor predictions. Check dataset quality and coverage before training.',
		'I made a tiny cat detector. For every new photo it finds the training photo that looks the most alike, and copies its label. Train it on this messy set first, then clean the data and train again.'
	],
	reactions: {
		messy:
			'Ouch, some new photos came out wrong, yet the model did exactly what it was taught. Tap a wrong guess to see which training photo it copied.',
		look: 'See the highlighted photo? That is the example it found most alike, and it simply copied that label. If the example is labelled wrong, the guess is wrong too.',
		fix: 'Nice catch, that label was wrong. One bad label quietly spoils every guess that leans on it.',
		oops: 'Hmm, that label was actually right, and now it is wrong. Swap it back, the model trusts every label you give it.',
		toss: 'Good call. Nobody can tell what is in a blurry photo, so it only teaches confusion. Out it goes.',
		toss_good:
			'That photo was actually a good one. Removing good examples leaves the model with less to learn from. Reset brings everything back.',
		still: 'Better, but not there yet. Tap a wrong guess to find the bad example hiding behind it.',
		clean:
			'Six out of six! Same model, same code, only the data got cleaner. That is why a model is only as good as its examples. Next, let us see how a machine [[learns from them|ai/training]].'
	},
	catLabel: 'cat',
	notLabel: 'not a cat',
	setTitle: 'Training photos ({n})',
	testTitle: 'Test data not used for training',
	trainBtn: 'Train and test',
	retrainBtn: 'Train again',
	reset: 'Reset',
	score: '{n} of 6 right',
	pickHint: 'Tap a training photo to check or fix it',
	chosen: 'Photo {n} is labelled {label}',
	blurChosen: 'A blurry photo labelled {label}',
	swapBtn: 'Swap label',
	removeBtn: 'Throw it out',
	photo: 'Training photo {n}',
	newPhoto: 'New photo {n}',
	lookHint: 'Tap a new photo to see which example it copied',
	copied: 'It copied photo {n}',
	stale: 'The data changed, train again to see',
	guessed: 'guess'
};
