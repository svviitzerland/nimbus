import type { TransactionText } from './types';

export const en: TransactionText = {
	title: 'Database transactions',
	intro: [
		"Sending money in an app feels like one action, but for the database it is two. Take 50000 out of Adi's balance, then add 50000 to Bima's. Two separate writes, one after the other.",
		"Now imagine the server loses power right between those two writes. Adi's money has already left, and it never reaches Bima. 50000 simply vanished into thin air.",
		'A <b>transaction</b> fixes that. You wrap the steps between <b>BEGIN</b> and <b>COMMIT</b>, and the database promises that either all of them happen or none of them do. Never anything in between.',
		'If something breaks before COMMIT, the database does a <b>ROLLBACK</b>. It undoes the half finished steps as if they never started (it keeps a little journal of every change exactly for this).',
		'[fyi] This all or nothing promise is called <b>atomicity</b>, the A in <b>ACID</b>, the set of guarantees SQL databases are famous for. It is why banks and online shops love the strict tables you met in [[SQL or NoSQL|resilience/database]].',
		'Your turn. Send Bima some money, then try pulling the plug halfway. Do it without a transaction first, then with one.'
	],
	reactions: {
		ok: 'Both writes ran, so nothing went wrong this time. But nothing was protecting them either. Now try the crash button.',
		vanish:
			'Ouch. Adi lost 50000 and Bima got nothing. The first write was saved, the second one never ran, and the bank now holds less money than before. Turn the transaction on and crash it again.',
		commit:
			'BEGIN, two writes, COMMIT. The moment COMMIT lands, both changes become permanent together, as one.',
		rollback:
			'Saved. The server died after the first write, but that write sat inside a transaction with no COMMIT yet. When the database woke up it rolled the change back, and not a single rupiah went missing.'
	},
	tableName: 'accounts',
	nameCol: 'name',
	balanceCol: 'balance',
	sender: 'Adi',
	receiver: 'Bima',
	accountOf: "{who}'s account",
	currency: 'Rp',
	locale: 'en-US',
	txLabel: 'Transaction',
	txOn: 'on',
	txOff: 'off',
	sendBtn: 'Send {amount} to {who}',
	crashBtn: 'Send it, and crash halfway',
	serverLabel: 'Database server',
	crashedTag: 'power lost',
	backTag: 'back up',
	logLabel: 'What the database runs',
	crashLine: 'the power goes out here',
	totalLabel: 'Money in the bank',
	totalOk: 'all accounted for',
	totalLost: '{amount} vanished'
};
