import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface TrainingText extends LessonText {
	/** One panel per beat of the guided visual (seven beats). */
	panels: GuidePanel[];
	apple: string; // the label apple, written under its basket
	orange: string; // the label orange
	/** The hand written rule card on the first beat. */
	ruleTitle: string;
	ruleLines: [string, string];
	/** Caption when the hand written rule sorts the tricky apple wrong. */
	ruleWrong: string;
	/** Chart axis names, the model only sees these two clues. */
	axisColour: string;
	axisSize: string;
	/** Caption while the model guesses, template with {label}. */
	guess: string;
	/** Caption while a new fruit rolls in. */
	incoming: string;
	/** Rule of thumb under the picture on the memory beat. */
	rule: string;
	/** The optional button on the last beat. */
	trickyBtn: string;
}
