import type { LessonText } from '../types';

export interface StorageTypesText extends LessonText {
	objectTitle: string;
	objectSub: string;
	objectNote: string;
	objectWhen: string[];
	objectFiles: string[];
	blockTitle: string;
	blockSub: string;
	blockNote: string;
	blockWhen: string[];
	blockMachine: string;
	fileTitle: string;
	fileSub: string;
	fileNote: string;
	fileWhen: string[];
	fileMachines: string[];
	fileDocs: string[];
	whenTitle: string;
	seenAll: string;
	hint: string;
}

export interface DatabaseText extends LessonText {
	sqlTitle: string;
	sqlSub: string;
	nosqlTitle: string;
	nosqlSub: string;
	tableName: string;
	columns: string[];
	rows: string[][];
	extraRows: string[][];
	addRow: string;
	schemaNote: string;
	/** Each doc is a name plus its own field labels, shapes differ on purpose. */
	docs: { name: string; fields: string[] }[];
	addDoc: string;
	freeNote: string;
	whenTitle: string;
	sqlWhen: string[];
	nosqlWhen: string[];
	done: string;
}
