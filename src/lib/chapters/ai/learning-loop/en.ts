import type { LearningLoopText } from './types';

export const en: LearningLoopText = {
	title: 'Gradient descent',
	intro: [
		'An AI <b>model</b> is a guessing machine with lots of little knobs inside (they are called <b>weights</b>, just like in the [[neural network|ai/neural-net]]). At first the knobs are set badly, so its guesses are wrong a lot.',
		'Let us pick just one knob. For every way you could turn it, the model is wrong by some amount. Draw all of that and you get a hill. High up means very wrong, and the bottom of the valley is the best setting.',
		'The tricky part is that the model cannot see the hill. It is like standing in thick fog. All it can feel is the ground right under it and which way it tilts. That tilt is called the <b>gradient</b>, which is just a fancy word for slope.',
		'So it does the simplest thing. Feel the slope, take a small step downhill, feel again, step again. This loop is called <b>gradient descent</b> (descent means going down), and almost every modern AI learns this way.',
		'[ingat] Gradient descent is walking downhill in fog. You cannot see the valley, so you feel the slope with your feet and keep stepping the way it goes down.',
		'How long each step is has a name too, the <b>learning rate</b>. Watch tiny steps first. They are safe, but the ball crawls and crawls, and training would take forever.',
		'Now giant leaps. Each jump overshoots the valley and lands even higher on the other side, until the ball flies right off the hill. People say the model <b>diverged</b>, and the training is ruined.',
		'A step in between is the sweet spot. The ball rolls down quickly and settles at the bottom. Picking that step size is one of the first things engineers tune before training.',
		'[fyi] Real models have millions or even billions of knobs, so their hill has that many directions at once. Nobody can picture it, but the idea is exactly the same, a small step downhill along every direction together.',
		'If you like, switch between the three step sizes and watch each one roll. Totally optional, the hill is not going anywhere.'
	],
	reactions: {
		small:
			'Tiny steps. Safe, but look at it crawl. Training a real model like this would burn days of time and a lot of electricity.',
		good: 'Just right. A few confident steps and it settles at the bottom of the valley. That is the step size engineers hope to find.',
		big: 'Giant leaps! Every landing is higher than the last, and off it goes. Too big a learning rate makes the model worse instead of better.'
	},
	panels: [
		{
			tag: 'The hill',
			title: 'Wrongness as a hill',
			body: 'Left and right is the knob setting. Up and down is <b>how wrong</b> the model is. The flag marks the least wrong spot.'
		},
		{
			tag: 'Fog',
			title: 'Only the slope is felt',
			body: 'The model cannot see the whole hill. The little arrow is the <b>gradient</b>, the tilt right under the ball, pointing downhill.'
		},
		{
			tag: 'The loop',
			title: 'Feel, step, repeat',
			body: 'Each step turns the knob a little downhill, and the <b>how wrong</b> bar shrinks. Training is this loop, many thousands of times.'
		},
		{
			tag: 'Make it stick',
			title: 'Walking downhill in fog',
			body: 'No map needed. Feel the slope with your feet, step the way it goes down, and repeat until the ground is flat.'
		},
		{
			tag: 'Too small',
			title: 'Crawling',
			body: 'With a tiny <b>learning rate</b> every step barely moves. Nothing goes wrong, it is just very slow and very expensive.'
		},
		{
			tag: 'Too big',
			title: 'Flying off',
			body: 'Leaps that are too big jump over the valley. Each landing is higher than the last, so the model gets worse instead of better.'
		},
		{
			tag: 'Just right',
			title: 'The sweet spot',
			body: 'Big enough to move quickly, small enough not to overshoot. A handful of steps and the ball rests at the bottom.'
		},
		{
			tag: 'Try it',
			title: 'Three step sizes',
			body: 'Switch the step size and watch the same ball crawl, settle, or fly away. Same hill, same start, only the step changes.'
		}
	],
	axisKnob: 'knob setting',
	axisError: 'how wrong',
	lowest: 'least wrong',
	errorLabel: 'How wrong',
	stepN: 'Step {n}',
	bottom: 'At the bottom after {n} steps',
	far: 'Still far from the bottom after {n} steps',
	flew: 'Flew off the hill',
	rule: 'Feel the slope, step downhill, repeat.',
	sizes: ['tiny steps', 'just right', 'giant leaps'],
	sizeLabel: 'Step size, {x}',
	another: 'Try another step size'
};
