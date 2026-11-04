import type { TransactionText } from './types';

export const en: TransactionText = {
	title: 'Database transactions',
	intro: [
		"Sending money in an app feels like one action, but for the database it is two. Take 50000 out of Adi's balance, then add 50000 to Bima's. Two separate writes, one after the other. Watch the coin travel.",
		"Now imagine the server loses power right between those two writes. Adi's money has already left, and it never reaches Bima. 50000 simply vanished into thin air.",
		'A <b>transaction</b> fixes that. You wrap the steps between <b>BEGIN</b> and <b>COMMIT</b>, and the database promises that either all of them happen or none of them do. The moment COMMIT lands, both changes become permanent together.',
		'And if something breaks before COMMIT, the database does a <b>ROLLBACK</b>. When it wakes up, it undoes the half finished steps as if they never started (it keeps a little journal of every change exactly for this). Adi gets his money back.',
		'[ingat] A transaction is <b>all or nothing</b>, just like a bank transfer. The money either arrives in full or never leaves. It never gets stuck halfway.',
		'[fyi] This all or nothing promise is called <b>atomicity</b>, the A in <b>ACID</b>, the set of guarantees SQL databases are famous for. It is why banks and shops love the strict tables you met in [[SQL or NoSQL|resilience/database]].',
		'If you are curious, switch the transaction off and on, and watch the same crash end two different ways. Totally optional.'
	],
	reactions: {
		off: 'No transaction, and the crash lands between the two writes. Adi lost 50000, Bima got nothing.',
		on: 'Transaction on. Same crash, but the database rolls the first write back and not a single rupiah goes missing.'
	},
	panels: [
		{
			tag: 'Two writes',
			title: 'One transfer, two steps',
			body: 'The first write takes the money out of one account. The second puts it into the other. Between them, the money is in neither.'
		},
		{
			tag: 'The crash',
			title: 'Stuck halfway',
			body: 'The first write is already saved, the second never runs. Add up all the balances and you now get less than before.'
		},
		{
			tag: 'Transaction',
			title: 'BEGIN and COMMIT',
			body: 'Everything between <b>BEGIN</b> and <b>COMMIT</b> counts as one unit. Nothing is final until COMMIT.'
		},
		{
			tag: 'Rollback',
			title: 'Undo the half done',
			body: 'With no COMMIT yet, the database reads its journal after the crash and puts every changed value back.'
		},
		{
			tag: 'Make it stick',
			title: 'All or nothing',
			body: 'Either every step happens, or none of them do. There is no in between.'
		},
		{
			tag: 'Try it',
			title: 'Same crash, two endings',
			body: 'Flip the switch. The crash always hits in the same place, only the ending changes.'
		}
	],
	tableName: 'accounts',
	nameCol: 'name',
	balanceCol: 'balance',
	sender: 'Adi',
	receiver: 'Bima',
	currency: 'Rp',
	locale: 'en-US',
	serverLabel: 'Database server',
	crashedTag: 'power lost',
	backTag: 'back up',
	logLabel: 'What the database runs',
	crashLine: 'the power goes out here',
	totalLabel: 'Money in the bank',
	totalOk: 'all accounted for',
	totalLost: '{amount} vanished',
	savedTag: 'saved',
	rule: 'All or nothing, never halfway.',
	txLabel: 'Transaction',
	txOn: 'on',
	txOff: 'off'
};
