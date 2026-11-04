import type { LessonText } from '../../types';

export type SqlColumn = 'name' | 'price' | 'stock';
/** The questions the guided visual asks, in order (the last one, group, runs on the orders table). */
export type SqlQuestionId = 'all' | 'pick' | 'out' | 'cheap' | 'group';

export interface SqlProduct {
	name: string;
	price: number;
	stock: number;
}

export interface SqlPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface SqlText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: SqlPanel[];
	/** Table name as it appears in the query (a SQL identifier, no spaces). */
	tableName: string;
	/** Column names as they appear in the query (SQL identifiers, no spaces). */
	columns: Record<SqlColumn, string>;
	/** The rows of the products table. */
	products: SqlProduct[];
	/** Each question in plain words, shown above the query that answers it. */
	questions: Record<SqlQuestionId, string>;
	/** The aggregation scene, a second small table of orders (SQL identifiers, no spaces). */
	ordersTable: string;
	orderColumns: { city: string; total: string };
	orders: { city: string; total: number }[];
	/** Caption over the grouped answer. */
	resultLabel: string;
	questionLabel: string;
	fileName: string;
	/** Template with {n}, shown once the database has answered. */
	rowsBack: string;
	/** Small tags next to each line of the query on the remember scene. */
	clauseTags: { select: string; from: string; where: string; order: string };
	rule: string;
	/** The optional button on the last scene. */
	another: string;
}
