import type { LessonText } from '../../types';

export interface OverfittingPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface OverfittingText extends LessonText {
	/** One panel per scene of the guided visual (seven scenes). */
	panels: OverfittingPanel[];
	xAxis: string; // axis, house size
	yAxis: string; // axis, price
	bend: string; // aria label of the optional bendiness slider
	stiff: string; // left end of the slider
	wiggly: string; // right end of the slider
	verdicts: { under: string; fit: string; mid: string; over: string }; // pill above the chart
	trainScore: string; // score row, the practice exam (houses it studied)
	testScore: string; // score row, the real exam (houses it never saw)
	hidden: string; // real exam score before the new houses arrive
	legendTrain: string;
	legendTest: string;
	rule: string; // the rule of thumb line on the memory beat
	chartLabel: string; // aria label of the chart
}
