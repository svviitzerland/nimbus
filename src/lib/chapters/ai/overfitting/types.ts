import type { LessonText } from '../../types';

export interface OverfittingText extends LessonText {
	xAxis: string; // axis, house size
	yAxis: string; // axis, price
	bend: string; // aria label of the flexibility slider
	stiff: string; // left end of the slider
	wiggly: string; // right end of the slider
	verdicts: { under: string; fit: string; mid: string; over: string }; // pill above the chart
	trainScore: string; // score row, the houses it studied
	testScore: string; // score row, the houses it never saw
	hidden: string; // test score before the new houses arrive
	revealBtn: string; // bring in the hidden houses
	legendTrain: string;
	legendTest: string;
	chartLabel: string; // aria label of the chart
}
