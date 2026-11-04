import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface SupervisedText extends LessonText {
	/** One panel per beat of the guided visual (eight beats). */
	panels: GuidePanel[];
	genres: [string, string, string]; // chill, dance, rock, the tags people gave the songs
	xAxis: string; // tempo, slow to fast
	yAxis: string; // energy, calm to loud
	/** Small badge on the chart, with labels or without. */
	withKey: string;
	withoutKey: string;
	/** Caption while a new song gets tagged, template with {label}. */
	tagged: string;
	/** Name of a group the machine found, template with {n}. */
	groupName: string;
	/** Rule of thumb under the chart on the memory beat. */
	rule: string;
	/** The optional button on the last beat. */
	againBtn: string;
}
