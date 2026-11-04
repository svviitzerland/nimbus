import type { LessonText } from '../../types';

export interface GuidePanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

/** The four kinds of mess the dataset gets cleaned of. */
export type DataProblem = 'wrong' | 'blurry' | 'copy' | 'missing';

export interface DataText extends LessonText {
	/** One panel per beat of the guided visual (ten beats). */
	panels: GuidePanel[];
	/** File name on top of the spreadsheet. */
	sheetName: string;
	colPhoto: string;
	colLabel: string;
	cat: string; // the label "cat"
	notCat: string; // the label "not a cat"
	/** Short note next to a row that has a problem. */
	problems: Record<DataProblem, string>;
	/** Footer under the sheet, template with {n} rows. */
	count: string;
	/** Footer once everything is clean, template with {n} rows. */
	cleanCount: string;
	/** Rule of thumb under the sheet on the memory beat. */
	rule: string;
	/** The optional toggle on the last beat. */
	messBtn: string;
	cleanBtn: string;
	/** Aria labels of the little pictures. */
	pics: { cat: string; dog: string; blurry: string };
}
