import type { LessonText } from '../../types';

export interface TransactionText extends LessonText {
	/** Table and column names as they appear in SQL. */
	tableName: string;
	nameCol: string;
	balanceCol: string;
	/** The sender and the receiver. */
	sender: string;
	receiver: string;
	/** Template with {who}, the label on an account card. */
	accountOf: string;
	currency: string; // shown before amounts, e.g. Rp
	locale: string;
	txLabel: string;
	txOn: string;
	txOff: string;
	sendBtn: string; // template with {amount} and {who}
	crashBtn: string;
	serverLabel: string;
	crashedTag: string;
	backTag: string;
	logLabel: string;
	crashLine: string; // shown in the log where the power went out
	totalLabel: string;
	totalOk: string;
	totalLost: string; // template with {amount}
}
