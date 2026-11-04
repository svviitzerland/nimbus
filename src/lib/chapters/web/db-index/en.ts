import type { DbIndexText } from './types';

export const en: DbIndexText = {
	title: 'Database indexes',
	intro: [
		'The nimbus.com shop keeps growing. One day its users table holds a <b>million</b> people, and every time someone logs in, the database has to find one email among all of them.',
		'Left alone, the database does it the slow way. It starts at the first row and checks every single one until it finds a match. That is called a <b>full table scan</b>, like hunting for one word by reading a whole book from page one.',
		'Books solved this long ago with the <b>index</b> at the back. The words sit in alphabetical order, each with its page number. You jump to the right letter, find the word, and go straight to the page.',
		'A <b>database index</b> is the same trick. The database keeps a sorted copy of one column (here the emails), and every entry points at its row. Because it is sorted, the search can jump to the middle and throw away half the list with every hop.',
		'Now race them on a million rows. The scan crawls through hundreds of thousands of rows, while the index needs about 20 hops. That is the difference between a login that feels instant and one that makes people tap the button again.',
		'[ingat] A database index is the index at the back of a book. Jump to the word, do not read from page one. And a bonus rule, every time the table doubles, the index needs just <b>one</b> more hop.',
		'[fyi] An index is not free. Every new user has to be slotted into it too, so saving gets a little slower, and it takes extra disk space. That is why you index the columns you search by often, not every column.',
		'If you are curious, change the size of the table and watch the race again. Totally optional.'
	],
	reactions: {
		small:
			'A thousand rows, and both finish in a blink. For a tiny table the index hardly matters.',
		mid: 'A hundred thousand rows. The scan starts to drag, while the index needs only 17 hops.',
		big: 'A million rows, the scan reads hundreds of thousands of them, the index about 20.',
		huge: 'A hundred million rows, and the index still needs fewer than 30 hops. That is how huge apps stay fast.'
	},
	panels: [
		{
			tag: 'The table',
			title: 'A million rows',
			body: 'Each square stands for a crowd of rows in the <b>users</b> table. Somewhere in there is the one email we want.'
		},
		{
			tag: 'Full table scan',
			title: 'One row at a time',
			body: 'With no help, the database reads the rows in order and compares each one. The bigger the table, the longer it takes.'
		},
		{
			tag: 'A book index',
			title: 'Sorted words, page numbers',
			body: 'Because the words are in alphabetical order, you find one in seconds, and its page number takes you straight there.'
		},
		{
			tag: 'Database index',
			title: 'Cut the list in half',
			body: 'Look at the middle entry. Too early in the alphabet? Throw away the first half. Repeat, and the list shrinks very fast.'
		},
		{
			tag: 'The race',
			title: 'Scan versus index',
			body: 'Both look for the same email in the same table. One reads row after row, the other hops straight to it.'
		},
		{
			tag: 'Remember',
			title: 'The back of the book',
			body: 'Jump, do not read. Twice the rows only costs the index one more hop, so it stays quick even when the table is huge.'
		},
		{
			tag: 'Try it',
			title: 'Change the size',
			body: 'Each tap changes how many rows are in the table and runs the race again.'
		}
	],
	locale: 'en-US',
	tableName: 'users',
	target: 'sari@nimbus.com',
	gridNote: 'each square is many rows',
	rowsChecked: '{n} rows checked',
	steps: '{n} hops',
	found: 'found',
	bookTitle: 'Index',
	bookEntries: [
		{ word: 'browser', page: 12 },
		{ word: 'cache', page: 27 },
		{ word: 'database', page: 42 },
		{ word: 'email', page: 58 },
		{ word: 'server', page: 73 },
		{ word: 'table', page: 91 }
	],
	bookWord: 'database',
	pageLabel: 'page {n}',
	sortedLabel: 'sorted emails',
	emails: [
		'adi@nimbus.com',
		'bima@nimbus.com',
		'citra@nimbus.com',
		'dewi@nimbus.com',
		'eko@nimbus.com',
		'gita@nimbus.com',
		'rudi@nimbus.com',
		'sari@nimbus.com'
	],
	hop: 'hop {n}',
	pointsTo: 'points at row {n}',
	scanLane: 'No index',
	indexLane: 'With an index',
	sizes: ['1 thousand', '100 thousand', '1 million', '100 million'],
	sizeLine: '{size} rows',
	rule: 'Twice the rows, just one more hop.',
	grow: 'Change the table size'
};
