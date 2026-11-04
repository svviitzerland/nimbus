import type { LessonText } from '../../types';

export interface TransactionPanel {
	tag?: string;
	title: string;
	/** May hold simple HTML like <b>. */
	body: string;
}

export interface TransactionText extends LessonText {
	/** One panel per scene of the guided visual (six scenes). */
	panels: TransactionPanel[];
	/** Table and column names as they appear in SQL. */
	tableName: string;
	nameCol: string;
	balanceCol: string;
	/** The sender and the receiver. */
	sender: string;
	receiver: string;
	currency: string; // shown before amounts, e.g. Rp
	locale: string;
	serverLabel: string;
	crashedTag: string;
	backTag: string;
	logLabel: string;
	/** Shown in the log where the power went out. */
	crashLine: string;
	totalLabel: string;
	totalOk: string;
	/** Template with {amount}. */
	totalLost: string;
	savedTag: string;
	rule: string;
	/** The optional switch on the last scene. */
	txLabel: string;
	txOn: string;
	txOff: string;
}
