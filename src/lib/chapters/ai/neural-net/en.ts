import type { NeuralNetText } from './types';

export const en: NeuralNetText = {
	title: 'What is a neural network',
	intro: [
		'Every time AI is in the news, the words <b>neural network</b> show up. It sounds very fancy, but inside it is just small sums arranged neatly. Here is a real one, small enough to take apart.',
		'Each circle is a <b>neuron</b>, a tiny calculator. They stand in columns called <b>layers</b>. Numbers come in on the left (the inputs), pass through the middle (the hidden layer), and the answer pops out on the right (the output).',
		'Every line joining two neurons has a <b>weight</b>, a number that says how much that signal matters. A thick blue line is listened to a lot, a red line holds things back.',
		'A neuron only does one job. It adds up everything coming in, each signal multiplied by the weight of its line. If the total is big enough, it <b>fires</b>, glows, and passes its signal on. Watch the bottom one.',
		'[ingat] Add it up, then fire. A neuron is like a kettle, heat comes in from every side and adds up, and once it is hot enough it whistles.',
		'Now a real job. I can never decide whether to bring an umbrella, so this network decides from three clues, a cloudy sky, humid air, and a rain forecast. Here are four past days with the right answer. Watch it try each one.',
		'Only two right, the weights are not good yet. So the network <b>trains</b>. It checks how far off each guess is, then nudges every weight a little in the direction that makes it less wrong. Watch the lines change.',
		'Four out of four, and nobody touched a thing. Nudging weights bit by bit like this is called [[gradient descent|ai/learning-loop]], the recipe behind almost all modern AI. Big models do exactly this, just with billions of lines.',
		'[fyi] The name was inspired by nerve cells in the brain, which also pass signals to each other. But do not picture it too literally, underneath it is just multiplying and adding, repeated millions of times.',
		'If you are curious, tap any line and nudge its weight. Watch the neurons glow differently and see whether the four days stay right.'
	],
	reactions: {
		select:
			'That line is one weight. Blue pushes the next neuron to light up, red holds it back. Slide the number and watch.',
		tweak:
			'The glow changed, but the answers held. A network has some slack, one weight alone rarely flips everything.',
		worse:
			'Oops, a day just went wrong. One weight can be enough to break an answer, that is why training checks every day at once.',
		better: 'Back to four out of four. You just did a tiny bit of training by hand.'
	},
	panels: [
		{
			tag: 'Neural network',
			title: 'Small sums, neatly arranged',
			body: 'Signals flow from left to right along the lines. Brighter circles are neurons that are firing.'
		},
		{
			tag: 'Layers',
			title: 'Columns of neurons',
			body: 'The <b>input layer</b> holds the clues, the <b>hidden layer</b> does the thinking in between, and the <b>output layer</b> gives the answer.'
		},
		{
			tag: 'Weights',
			title: 'How much each line matters',
			body: 'Thickness shows how big the weight is. Blue means it pushes the next neuron up, red means it pushes it down.'
		},
		{
			tag: 'Neuron',
			title: 'Add up, then fire',
			body: 'The gauge beside the neuron is its total. Each clue that switches on adds its weight. Past the mark, the neuron lights up.'
		},
		{
			tag: 'Make it stick',
			title: 'Like a kettle',
			body: 'Heat adds up from every side, and only when it is hot enough does it whistle. A neuron adds up signals and only fires past its mark.'
		},
		{
			tag: 'Its job',
			title: 'Umbrella or not',
			body: 'Each day switches some clues on (1) or off (0). The answer neuron glows bright for umbrella and stays dim for no umbrella.'
		},
		{
			tag: 'Training',
			title: 'Nudge every weight a little',
			body: 'After every round it compares its answers with the right ones and shifts each line a tiny bit. Watch thicknesses and colours change.'
		},
		{
			tag: 'Trained',
			title: 'All four days right',
			body: 'Nobody wrote a rule like "forecast means umbrella". The network found it in the weights by itself.'
		},
		{
			tag: 'Try it',
			title: 'Tweak one weight',
			body: 'Tap a line, then slide its weight. Some lines barely matter, others flip an answer on their own.'
		}
	],
	inputs: ['Cloudy', 'Humid', 'Forecast'],
	layerIn: 'Inputs',
	layerHidden: 'Hidden layer',
	layerOut: 'Output',
	outputLabel: 'Umbrella?',
	dayLabel: 'Day {n}',
	answerYes: 'umbrella',
	answerNo: 'no umbrella',
	score: '{n} of 4 days right',
	training: 'Learning, round {n}',
	trained: 'Learned it in {n} rounds',
	total: 'total',
	bar: 'fire',
	rule: 'Add it up, then fire',
	verdictYes: 'Bring an umbrella',
	verdictNo: 'No umbrella needed',
	tapHint: 'Tap any line to tune its weight',
	edgeLabel: 'From {a} to {b}',
	neuronName: 'middle neuron {n}',
	outputName: 'the answer neuron',
	weightLabel: 'Weight',
	stronger: 'Stronger',
	weaker: 'Weaker',
	reset: 'Put it back'
};
