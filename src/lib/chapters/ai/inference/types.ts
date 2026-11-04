import type { LessonText } from '../../types';

export interface InferencePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface InferenceText extends LessonText {
	/** One panel per scene of the guided visual (seven scenes). */
	panels: InferencePanel[];
	examples: { text: string; spam: boolean }[]; // the labelled emails the filter trains on
	questions: string[]; // emails the finished model gets asked about
	trainTitle: string; // caption over the training half
	inferTitle: string; // caption over the inference half
	reading: string; // template with {n} and {total}, which example it is reading
	day: string; // template with {n}, how many days of computer time so far
	modelFile: string; // name of the model file
	frozen: string; // the model does not learn while answering
	you: string; // caption under the phone
	server: string; // caption under the server
	spam: string; // answer, spam
	ham: string; // answer, not spam
	spamTag: string; // label on a training example that is spam
	hamTag: string; // label on a training example that is normal mail
	fast: string; // how long one answer takes
	answered: string; // template with {n}, questions answered so far
	sep: string; // thousands separator for {n} in answered
	longBar: string; // comparison bar, training
	shortBar: string; // comparison bar, one answer
	longTime: string; // how long training takes
	shortTime: string; // how long one answer takes
	rule: string; // rule of thumb line on the memory beat
	askHint: string; // the optional play, tap an email to ask
}
