import type { NeuralNetText } from './types';

export const en: NeuralNetText = {
	title: 'What is a neural network',
	intro: [
		"Every time AI is in the news, the words <b>neural network</b> show up. It sounds very fancy, but inside it is just small sums arranged neatly. Let's take one apart.",
		'Picture lots of <b>tiny calculators</b> lined up in a few rows. Each calculator is called a <b>neuron</b>, and each row is called a <b>layer</b>. Numbers come in on the left, get passed to the right, until the answer pops out at the end.',
		'Every line joining two neurons has a <b>weight</b>, a number that says how much that signal matters. A big weight means it is listened to a lot, a negative weight means it actually holds things back.',
		'A neuron only does one job. It adds up everything coming in (each multiplied by the weight of its line), then <b>lights up</b> when the total is big enough. The bigger the total, the brighter it glows.',
		"[fyi] The name really was inspired by nerve cells in the brain, which also pass signals to each other. But don't picture it too literally, underneath it is just multiplying and adding, repeated millions of times.",
		'So, I can never decide whether to bring an umbrella. This little network decides for me from three clues, a cloudy sky, humid air, and a rain forecast. Up top are four past days along with the right answer.',
		'[ingat] A neuron computes a weighted sum of inputs plus a bias, then applies an activation function.',
		'Tap the circles on the left to watch the signal flow. Then tap any line and tune its weight until all four days come out right. If you get stuck, let the network learn by itself.'
	],
	reactions: {
		input:
			'See the numbers flowing? Each input is just 1 or 0 (yes or no). Every middle neuron adds up what reaches it and glows by its total, and the last neuron makes the umbrella call.',
		select:
			'That line is one weight. Blue pushes a neuron to light up, red holds it back. The thicker the line, the bigger its say. Try sliding the number.',
		tweak:
			'You just changed a weight. Notice the neurons glow differently now, and the score up top can go up or down.',
		better: 'Up! One more day guessed right. Keep hunting for the right lines.',
		worse: 'Oops, it went down. Sometimes fixing one day breaks another, and that is the fun part.',
		hand: 'All four examples are correct after the weights change. You adjusted them manually. Automatic training calculates weight updates from loss.',
		learning:
			'Now it is trying on its own. Every step it checks how far off its guesses are, then nudges every weight a little in the direction that makes it less wrong.',
		trained:
			'Done, four out of four without you touching a thing. Nudging weights bit by bit like this is called [[gradient descent|ai/learning-loop]], the recipe behind almost all modern AI.'
	},
	inputs: ['Cloudy', 'Humid', 'Rain forecast'],
	layerIn: 'Inputs',
	layerHidden: 'Hidden layer',
	layerOut: 'Output',
	outputLabel: 'Umbrella?',
	dayLabel: 'Day {n}',
	answerYes: 'umbrella',
	answerNo: 'no umbrella',
	score: '{n} of 4 days right',
	trainBtn: 'Let it learn by itself',
	training: 'Learning, step {n}',
	trained: 'Learned it in {n} steps',
	reset: 'Reset',
	pickHint: 'Tap any line to tune its weight',
	inputHint: 'Tap the circles on the left to switch each clue on or off',
	edgeLabel: 'From {a} to {b}',
	neuronName: 'middle neuron {n}',
	outputName: 'the answer neuron',
	weightLabel: 'Weight',
	stronger: 'Stronger',
	weaker: 'Weaker',
	verdictYes: 'Bring an umbrella',
	verdictNo: 'No umbrella needed',
	confidence: '{n}% sure it will rain'
};
