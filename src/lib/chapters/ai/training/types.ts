import type { LessonText } from '../../types';

export interface TrainingText extends LessonText {
	apple: string; // the label apple
	orange: string; // the label orange
	basket: string; // template with {label}, aria label of a basket button
	labelHint: string; // template with {n}, how many of the 6 fruits are labelled so far
	readyHint: string; // every example labelled, time to train
	trainBtn: string;
	training: string; // shown while it studies the examples
	nextBtn: string; // sends a new fruit to the trained model
	guess: string; // template with {label} and {n}, the model's guess and how sure it is
	sorted: string; // template with {n}, how many new fruits the model sorted
	doneNote: string; // all new fruits sorted
	learnedTitle: string; // caption over the averages
	notYet: string; // nothing learned yet
	avg: string; // template with {label}, caption under an average fruit
	sees: string; // the model only sees colour and size
	byYou: string; // legend, a fruit you labelled
	byModel: string; // legend, a fruit the model sorted
	reset: string;
}
