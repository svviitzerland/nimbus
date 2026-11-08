import type { DbIndexText } from './types';

export const en: DbIndexText = {
	title: 'Database indexes',
	intro: [
		'The nimbus.com shop keeps growing. One day the users table holds a million people, and every time someone logs in, the database has to find one email among all of them.',
		'Left alone, the database does it the slow way. It starts at the first row and checks every single one until it finds a match. That is called a <b>full table scan</b>, like hunting for one word by reading a whole book from page one.',
		'Books solved this problem long ago with the <b>index</b> at the back. Words sit in alphabetical order, each with its page number. You jump to the right letter, find the word, and go straight to the page.',
		'A <b>database index</b> is the same trick. The database keeps a sorted copy of one column (here the emails) in a tree shaped structure, each entry pointing at its row. To find an email it keeps cutting the search in half, so a million rows take only about 20 steps.',
		'[fyi] An index is not free. Every new user has to be slotted into the index too, so saving gets a little slower, and the index takes extra disk space. That is why you index the columns you search by often, not every column.',
		'[ingat] An index helps find rows without scanning the whole table. Its benefit depends on the query, index type, and data being retrieved.',
		'Your turn. Here are two copies of the same users table, one without an index and one with. Race them, then drag the table bigger and race again.'
	],
	reactions: {
		small:
			'With a thousand rows both finish in a blink. For a tiny table the index hardly matters, a computer reads a thousand rows faster than you can blink. Make the table bigger.',
		mid: 'Now a gap shows up. The scan checked tens of thousands of rows while the index needed about 17 hops. Keep going.',
		big: 'A million rows. The scan read through hundreds of thousands of rows, the index about 20. That gap is the difference between a login that feels instant and one that makes people tap the button again.',
		huge: 'A hundred million rows, and the index still needs fewer than 30 steps. Every time the table doubles, the index only adds one more step. That is how huge apps stay fast.'
	},
	locale: 'en-US',
	tableName: 'users',
	emailCol: 'email',
	target: 'sari@nimbus.com',
	sizeLabel: 'Rows in the table',
	sizes: ['1 thousand', '100 thousand', '1 million', '100 million'],
	scanLane: 'No index',
	scanSub: 'checks the rows one by one',
	indexLane: 'With an index',
	indexSub: 'cuts the search in half each hop',
	checked: '{n} rows checked',
	foundTag: 'found',
	raceBtn: 'Start the race',
	againBtn: 'Race again',
	fasterBy: 'The index checked {x} times fewer rows',
	tie: 'At this size both are done in under a millisecond',
	idle: 'Both lanes are looking for the same email'
};
