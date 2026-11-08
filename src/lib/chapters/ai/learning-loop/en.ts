import type { LearningLoopText } from './types';

export const en: LearningLoopText = {
	title: 'Gradient descent',
	intro: [
		'Remember the umbrella [[neural network|ai/neural-net]] that learned by itself? Every step it nudged its weights a little so it was a bit less wrong. Today we zoom in on that one move, called <b>gradient descent</b>.',
		'Picture just one of those weights. For every value you could give it, the network gets some number of days wrong. Draw that out and you get a landscape, high where it guesses badly and low where it guesses well. The model wants the <b>bottom of the valley</b>.',
		'The <b>gradient</b> describes how loss changes with the weights. In this single weight diagram, it appears as the curve’s slope at the ball’s position.',
		'Gradient descent updates weights in the direction opposite to the gradient. Repeat prediction, loss calculation, and weight updates. The step size determines how far weights move.',
		'How big each step is has a name too, the <b>learning rate</b>. Tiny steps are safe but painfully slow. Giant leaps can jump right over the valley and land higher than where they started.',
		'[fyi] A model can have many weights. Its gradient contains the derivative of loss with respect to each weight. The optimizer uses these values to calculate parameter updates.',
		'[ingat] <b>New weight = old weight − learning rate × gradient.</b> Subtraction points toward a local decrease in loss. An oversized step can overshoot.',
		'Here is my ball on the error hill, sitting on a bad weight. Pick a step size, then take steps or let it roll. Try a tiny one, a huge one, and find one that reaches the bottom quickly.'
	],
	reactions: {
		step: 'One step! The ball felt the slope under it (that little arrow) and moved downhill. Watch the error meter, it just dropped a bit.',
		small:
			'Steps this tiny are safe, but look how slowly it crawls. Training a real AI like this would take ages and burn a lot of electricity. Try a bigger step.',
		zigzag:
			'See it hopping from one side of the valley to the other? The step is a bit too big, so it overshoots, but it still settles down in the end.',
		big: 'Whoa, every leap lands higher than the last! When the learning rate is too big the model gets worse instead of better. Pull the slider back.',
		flew: 'It flew right off the hill. In real training this is when the numbers explode and the model is ruined (people say it <b>diverged</b>). Reset and pick a gentler step.',
		slow: 'Made it to the bottom, though it took a while. It works, but engineers hunt for a step size that gets there faster. Can you do it in a dozen steps or fewer?',
		bottom:
			'The bottom, in just a few steps! That is the sweet spot. The umbrella network did exactly this, only for all its weights at once and thousands of times over.'
	},
	axisWeight: 'the weight',
	axisError: 'how wrong',
	lowest: 'least wrong',
	stepBtn: 'Take one step',
	rollBtn: 'Let it roll',
	rolling: 'Rolling, step {n}',
	reset: 'Reset',
	rateLabel: 'Step size (learning rate)',
	rateLow: 'tiny steps',
	rateHigh: 'giant leaps',
	rateTags: ['tiny', 'good', 'bouncy', 'too big'],
	errorLabel: 'How wrong',
	steps: '{n} steps',
	slopeHint: 'The arrow shows which way is downhill',
	flew: 'It flew off the hill',
	bottom: 'Reached the bottom in {n} steps'
};
