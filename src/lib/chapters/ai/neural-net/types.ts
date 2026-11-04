import type { LessonText } from '../../types';

export interface NeuralNetPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface NeuralNetText extends LessonText {
	/** One panel per scene of the guided visual (nine scenes). */
	panels: NeuralNetPanel[];
	/** The three inputs, in order (cloudy sky, humid air, rain forecast). */
	inputs: string[];
	layerIn: string; // caption over the input column
	layerHidden: string; // caption over the middle column
	layerOut: string; // caption over the output column
	outputLabel: string; // small label under the output node
	dayLabel: string; // template with {n}
	answerYes: string; // the right answer on a day chip, bring the umbrella
	answerNo: string; // the right answer on a day chip, leave it home
	score: string; // template with {n}, how many of the 4 days the network gets right
	training: string; // template with {n}, the step counter while it learns
	trained: string; // template with {n}, once it has learned
	total: string; // label of the little gauge beside the neuron, the total coming in
	bar: string; // label of the mark on that gauge, big enough to fire
	rule: string; // rule of thumb line on the memory beat
	verdictYes: string;
	verdictNo: string;
	tapHint: string; // the optional play, tap a line
	edgeLabel: string; // template with {a} and {b}, the selected connection
	neuronName: string; // template with {n}, a middle neuron
	outputName: string; // the output neuron, as named in edgeLabel
	weightLabel: string;
	stronger: string; // aria label for the plus button
	weaker: string; // aria label for the minus button
	reset: string; // put the weights back to the trained ones
}
