import type { LessonText } from '../../types';

export interface NeuralNetText extends LessonText {
	/** The three inputs, in order (cloudy sky, humid air, rain forecast). */
	inputs: string[];
	layerIn: string; // caption over the input column
	layerHidden: string; // caption over the middle column
	layerOut: string; // caption over the output column
	outputLabel: string; // small label under the output node
	dayLabel: string; // template with {n}
	answerYes: string; // the right answer on a day card, bring the umbrella
	answerNo: string; // the right answer on a day card, leave it home
	score: string; // template with {n}, how many of the 4 days the network gets right
	trainBtn: string; // lets the network learn by itself
	training: string; // template with {n}, the step counter while it learns
	trained: string; // template with {n}, once it has learned
	reset: string;
	pickHint: string; // shown before any connection is selected
	inputHint: string; // nudge to tap the input nodes
	edgeLabel: string; // template with {a} and {b}, the selected connection
	neuronName: string; // template with {n}, a middle neuron
	outputName: string; // the output neuron, as named in edgeLabel
	weightLabel: string;
	stronger: string; // aria label for the plus button
	weaker: string; // aria label for the minus button
	verdictYes: string;
	verdictNo: string;
	confidence: string; // template with {n}, how sure the network is it will rain
}
