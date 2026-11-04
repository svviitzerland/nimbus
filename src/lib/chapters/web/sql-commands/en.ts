import type { SqlCommandsText } from './types';

export const en: SqlCommandsText = {
	title: 'Kinds of SQL commands',
	intro: [
		'People are signing up on nimbus.com, so the database needs a <b>users</b> table. Everything you tell a database is a SQL command, and the commands come in a few families. Each family touches a different part of the database.',
		'First the table has to exist. <b>CREATE TABLE</b> builds its shape, the table name and its columns. There are no rows yet, just an empty cupboard with labelled shelves. Commands that build shapes are called <b>DDL</b> (Data Definition Language).',
		'Shapes can change later. <b>ALTER TABLE</b> adds a new column, here a city for every user. And <b>DROP TABLE</b> throws the whole table away, rows and all. CREATE, ALTER, and DROP are the DDL trio.',
		'Now the rows. <b>INSERT</b> puts a new row in the table, one for every person who signs up. Commands that work with the rows themselves are called <b>DML</b> (Data Manipulation Language).',
		'DML has three more friends. <b>SELECT</b> reads rows, <b>UPDATE</b> changes a value, and <b>DELETE</b> removes a row. Watch closely, the shape of the table never changes, only what lives inside it.',
		'Not everyone should touch everything. <b>GRANT</b> gives someone permission, like letting Dina from support read the users. <b>REVOKE</b> takes it back. These two are <b>DCL</b> (Data Control Language), the keys to the database.',
		'One small family is left, <b>TCL</b>. <b>COMMIT</b> makes a group of changes permanent and <b>ROLLBACK</b> cancels them, so the steps happen all together or not at all. You will see them up close in [[transactions|web/transaction]].',
		'[ingat] Think of a cupboard. <b>DDL</b> builds the cupboard, <b>DML</b> puts things in and takes them out, <b>DCL</b> hands out the keys, and <b>TCL</b> says done, keep it. Shape, rows, keys, save.',
		'[fyi] The big erasers deserve respect. <b>DELETE</b> without a WHERE empties every row, and <b>DROP</b> makes the whole table vanish. That is why real teams give DROP permission to only a few people.'
	],
	reactions: {},
	panels: [
		{
			tag: 'Families',
			title: 'Four kinds of commands',
			body: 'SQL commands are grouped by what they touch. The <b>shape</b> of a table, the <b>rows</b> inside it, the <b>keys</b> (who may use it), and when changes get <b>saved</b>.'
		},
		{
			tag: 'DDL',
			title: 'Build the shape',
			body: 'CREATE TABLE names the table and its columns. Each column gets a type, like a whole number (INT) or text (TEXT).'
		},
		{
			tag: 'DDL',
			title: 'Change the shape',
			body: 'ALTER adds, renames, or removes columns. DROP deletes the table itself, and there is no undo button.'
		},
		{
			tag: 'DML',
			title: 'Add rows',
			body: 'INSERT adds one new row. The columns stay exactly the same, the table just grows one row longer.'
		},
		{
			tag: 'DML',
			title: 'Read, change, remove',
			body: 'SELECT reads, UPDATE changes values, and DELETE removes rows. A <b>WHERE</b> picks which rows they touch.'
		},
		{
			tag: 'DCL',
			title: 'Who may do what',
			body: 'GRANT hands a permission to an account, REVOKE takes it away. The web app may add and read users, while Dina only gets to look when she needs to.'
		},
		{
			tag: 'TCL',
			title: 'Save or cancel',
			body: 'Changes between <b>BEGIN</b> and <b>COMMIT</b> are saved together. Until COMMIT, the change is not final, and ROLLBACK would throw it away.'
		},
		{
			tag: 'Make it stick',
			title: 'Shape, rows, keys, save',
			body: 'DDL is the cupboard, DML is what is inside, DCL is the keys, and TCL is the done button.'
		},
		{
			tag: 'Careful',
			title: 'The big erasers',
			body: 'DELETE with no WHERE removes every row but keeps the table. DROP removes the table too. Read them twice before you run them.'
		}
	],
	tableName: 'users',
	columns: { id: 'id', name: 'name', email: 'email', city: 'city' },
	users: [
		{ id: 1, name: 'Adi', email: 'adi@nimbus.com', city: 'Solo' },
		{ id: 2, name: 'Bima', email: 'bima@nimbus.com', city: 'Bogor' },
		{ id: 3, name: 'Citra', email: 'citra@nimbus.com', city: 'Medan' }
	],
	newCity: 'Bali',
	familyWords: { ddl: 'shape', dml: 'rows', dcl: 'keys', tcl: 'save' },
	familyNames: {
		ddl: 'Data Definition',
		dml: 'Data Manipulation',
		dcl: 'Data Control',
		tcl: 'Transaction Control'
	},
	fileName: 'query.sql',
	noTable: 'There is no table yet',
	noRows: 'No rows yet',
	dropped: 'The table is gone',
	appLabel: 'Web app',
	staffLabel: 'Dina from support',
	staffUser: 'dina',
	accessLabel: 'Allowed on users',
	pending: 'not saved yet',
	saved: 'saved',
	cheatLabel: 'The four families',
	rule: 'DDL builds the shape, DML fills the rows, DCL hands out keys, TCL saves.'
};
