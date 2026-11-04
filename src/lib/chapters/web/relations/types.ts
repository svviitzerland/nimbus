import type { LessonText } from '../../types';

export interface RelationsPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface RelationsText extends LessonText {
	/** One panel per scene of the guided visual (eight scenes). */
	panels: RelationsPanel[];
	/** Table names as they appear in SQL (identifiers, no spaces). */
	customersTable: string;
	ordersTable: string;
	productsTable: string;
	/** Column names as they appear in SQL. */
	idCol: string;
	nameCol: string;
	/** The foreign keys in orders, pointing at customers and at products. */
	customerKey: string;
	productKey: string;
	/** Headers of the messy version of orders, where names are copied in. */
	copiedCustomer: string;
	copiedProduct: string;
	/** Row values, ids come from their position (1, 2, 3). */
	customers: [string, string, string];
	products: [string, string, string];
	/** Heading over the joined answer. */
	joinTitle: string;
	/** Template with {who} and {what}, one line of the joined answer. */
	bought: string;
	rule: string;
	/** The optional rename on the last scene, templates with {from} and {to}. */
	rename: string;
	renameBack: string;
	/** The new name for the second customer. */
	newName: string;
}
