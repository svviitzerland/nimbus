import type { LessonText } from '../../types';

export interface FineTuningPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface FineTuningText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes). */
	panels: FineTuningPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** Caption over the stack of past replies. */
	examplesLabel: string;
	/** Past replies from the team, each a short topic and the reply. The last one is the bad one. */
	examples: { q: string; a: string }[];
	/** Captions on the model picture. */
	modelLabel: string;
	frozenLabel: string;
	adapterLabel: string;
	/** Template with {n}, the training round being played. */
	round: string;
	/** Title of the support chat window. */
	chatTitle: string;
	/** The customer question asked in every scene. */
	question: string;
	/** How each model answers it. */
	general: string;
	good: string;
	/** The bad habit the bad example adds to every answer. */
	habit: string;
	/** Small tags on the reply bubble. */
	generalTag: string;
	tunedTag: string;
	/** Memory trick tag over the model, and the rule of thumb line under the picture. */
	memo: string;
	rule: string;
	/** The optional switch on the last beat. */
	removeBad: string;
	addBad: string;
}
