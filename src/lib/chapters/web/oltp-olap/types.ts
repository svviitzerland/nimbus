import type { LessonText } from '../../types';

export interface OltpOlapPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface OltpOlapOrder {
	id: number;
	item: string;
	/** In thousands of rupiah, kept short so it fits a small cell. */
	total: number;
}

export interface OltpOlapSide {
	name: string;
	full: string;
	/** A familiar person who works like this side. */
	like: string;
	points: string[];
	/** Real products on this side, for the last scene. */
	examples: string[];
}

export interface OltpOlapText extends LessonText {
	/** One panel per beat of the guided visual (ten scenes). */
	panels: OltpOlapPanel[];
	shoppers: string;
	appDb: string;
	analytics: string;
	warehouse: string;
	etl: string;
	clock: string;
	busy: string;
	/** Table and column names as they appear in SQL (identifiers, no spaces). */
	ordersTable: string;
	columns: { id: string; item: string; total: string };
	orders: OltpOlapOrder[];
	ordersToday: string;
	locale: string;
	/** Tag next to each fresh order on the OLTP scene. */
	writeTag: string;
	question: string;
	questionLabel: string;
	/** Template with {n}. */
	reading: string;
	slowNote: string;
	months: string[];
	answerNote: string;
	rowStore: string;
	colStore: string;
	blockLabel: string;
	readOne: string;
	readSum: string;
	/** Template with {n}. */
	opened: string;
	sources: string[];
	warehouseNote: string;
	etlSteps: { key: string; name: string; say: string }[];
	oltp: OltpOlapSide;
	olap: OltpOlapSide;
	examplesLabel: string;
}
