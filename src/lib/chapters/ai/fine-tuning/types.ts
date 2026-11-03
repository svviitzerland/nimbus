import type { LessonText } from '../../types';

/** One customer question, with how each model answers it. */
export interface FineTuneQuestion {
	q: string; // short chip label and the question itself
	general: string; // the untuned general model, polite but vague
	good: string; // the model tuned on good nimbus replies
	rude: string; // the model tuned on a set that included the rude reply
}

export interface FineTuningText extends LessonText {
	questionsLabel: string; // caption over the question chips
	questions: FineTuneQuestion[];
	/**
	 * Past support replies the learner can put in the training set. The stage decides which are
	 * good, rude, or wrong by position (0 good, 1 rude, 2 good, 3 wrong, 4 good).
	 */
	examples: { q: string; a: string }[];
	examplesLabel: string; // caption over the example cards
	wrongAdd: string; // the bad habit appended to every answer when the wrong reply was tuned in
	generalLabel: string; // name of the untuned model
	tunedLabel: string; // name of the tuned model
	notTuned: string; // placeholder in the tuned pane before any tuning
	askHint: string; // placeholder before any question is asked
	stale: string; // small note when the set changed after tuning
	setCount: string; // template with {n}, examples in the training set
	tuneBtn: string;
	tuning: string; // template with {n}, the round being trained
	frozen: string; // caption for the frozen base of the model picture
	adapter: string; // caption for the small tuned part
	qMark: string; // tiny tag before a past question
	aMark: string; // tiny tag before a past answer
	reset: string;
}
