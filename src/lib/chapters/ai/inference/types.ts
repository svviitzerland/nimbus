import type { LessonText } from '../../types';

export interface InferenceText extends LessonText {
	examples: { text: string; spam: boolean }[]; // the labelled emails the filter trains on
	questions: string[]; // ready made emails to ask about
	trainTitle: string; // card caption, the training phase
	trainBtn: string;
	reading: string; // template with {n} and {total}, which example it is reading
	days: string; // meter caption, how long the computers are busy
	daysValue: string; // template with {n}
	cost: string; // meter caption, the bill
	costValue: string; // template with {n}, the bill in millions of dollars
	decimal: string; // decimal mark for {n} in costValue
	scaleNote: string; // the meters show a big model at real scale
	trainedOnce: string; // template with {days} and {cost}, summary after training
	modelFile: string; // name of the model file
	modelInfo: string; // template with {n}, words it learned
	frozen: string; // the model does not learn while answering
	you: string; // caption over the phone
	server: string; // caption under the server
	inferTitle: string; // card caption, the inference phase
	askHint: string; // tap a message or type your own
	placeholder: string; // input placeholder
	askBtn: string;
	spam: string;
	ham: string; // not spam
	fast: string; // answer time under a millisecond
	ms: string; // template with {n}, answer time in milliseconds
	answered: string; // template with {n}, how many questions answered
	rushBtn: string; // send a thousand questions at once
	rushDone: string; // template with {time}
	spamTag: string; // the training example is spam
	hamTag: string; // the training example is not spam
}
