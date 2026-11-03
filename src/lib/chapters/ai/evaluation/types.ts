import type { LessonText } from '../../types';

export interface EvaluationText extends LessonText {
	modeReal: string; // the real test, uses the threshold
	modeLazy: string; // the lazy model, says healthy to everyone
	threshold: string; // template with {n}, the current threshold
	thresholdAria: string; // aria label of the threshold slider
	lazyNote: string; // shown instead of the slider in lazy mode
	accuracy: string; // caption of the accuracy number
	caught: string; // sick and flagged
	missed: string; // sick but sent home
	falseAlarm: string; // healthy but flagged
	cleared: string; // healthy and sent home
	axis: string; // chart axis, the risk score
	flagged: string; // label of the flagged zone
	sick: string; // legend, actually sick
	healthy: string; // legend, actually healthy
	patient: string; // template with {score} and {truth}, aria label of one patient
	chartLabel: string;
}
