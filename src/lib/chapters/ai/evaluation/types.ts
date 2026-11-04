import type { LessonText } from '../../types';

export interface EvaluationPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface EvaluationText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: EvaluationPanel[];
	axis: string; // under the number line, the risk score
	flagged: string; // label of the zone right of the line, called back
	home: string; // label of the zone left of the line, sent home
	caught: string; // sick and flagged
	missed: string; // sick but sent home
	falseAlarm: string; // healthy but flagged
	ofSick: string; // template with {n} and {total}, how many of the sick were caught
	accuracy: string; // template with {n}, share of right answers
	wide: string; // caption while the line sits far left
	tight: string; // caption while the line sits far right
	rule: string; // rule of thumb line on the memory beat
	thresholdAria: string; // aria label of the optional slider
	thresholdValue: string; // template with {n}, the slider's spoken value
	patient: string; // template with {score} and {truth}, aria label of one patient
	sick: string; // truth, actually sick
	healthy: string; // truth, actually healthy
	chartLabel: string;
}
