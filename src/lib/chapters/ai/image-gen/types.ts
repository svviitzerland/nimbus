import type { LessonText } from '../../types';

export interface ImageGenPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface ImageGenText extends LessonText {
	/** One panel per scene of the guided picture (nine scenes). */
	panels: ImageGenPanel[];
	/** Spoken description of the whole picture. */
	picture: string;
	/** The three prompts, in order (mountains with a cloud, an orange cat, a small house). */
	prompts: string[];
	/** The button drawn in the prompt bar. */
	generate: string;
	/** Template with {n} and {total}, the cleaning step. */
	stepLabel: string;
	/** Captions under the canvas. */
	noiseCaption: string;
	trainCaption: string;
	shapesCaption: string;
	detailsCaption: string;
	/** Template with {n}, which starting noise is used. */
	seedLabel: string;
	/** Memory trick tag and the rule of thumb line under the picture. */
	memo: string;
	rule: string;
	/** Caption over the optional prompt chips on the last beat. */
	tryLabel: string;
}
