import type { BlockchainText } from './types';

export const en: BlockchainText = {
	title: 'What is blockchain',
	intro: [
		'Picture a notebook of who paid whom, kept by a whole village instead of one bank clerk. Everyone holds a copy, anyone can check it, and nobody can quietly rewrite an old page. That is the idea behind a <b>blockchain</b>.',
		'Each page is a <b>block</b> holding a few records. Every block also stores the <b>fingerprint</b> (the hash, like in [[digital signatures|security/signature]]) of the block before it. Change anything inside a block and its fingerprint changes completely.',
		"So the blocks hang on each other like links in a chain. Edit an old block, and the next block's stored fingerprint no longer fits, which breaks that link and every link after it.",
		'Chaining records by hash is older than you might think. In 1991, Stuart Haber and W. Scott Stornetta used it to timestamp documents so nobody could backdate them. In 2008 someone calling themselves <b>Satoshi Nakamoto</b> combined it with other tricks to make <b>Bitcoin</b>, which went live in January 2009. Who Satoshi really is remains unknown.',
		'In Bitcoin, thousands of computers each keep a full copy. Before a computer may add a block it has to burn a lot of computing work (called <b>mining</b>, or proof of work). Rewriting history would mean redoing all that work faster than everyone else combined.',
		'[fyi] Same trick, different world. [[Git|compute/version-control]] links every commit to the fingerprint of the one before it, so a secretly changed old commit stands out too. Git just has no coins and no mining.',
		'An honest note. A blockchain is slow and costly next to an ordinary database. It only shines when many parties need a shared record and do not trust any single keeper. Plenty of "put it on the blockchain" projects from the hype years quietly shut down because a plain database would have done the job.',
		'Here is a tiny chain of four blocks, plus four computers holding copies. Change something in an old block, like an amount, and watch what happens to the rest.'
	],
	reactions: {
		broken:
			"The chain snapped. Your edit changed that block's fingerprint, but the next block still remembers the old one. The link breaks, and every block after it can no longer be trusted.",
		tip: 'You changed the newest block, so no later block notices yet. But look at the other computers, their last fingerprint differs from yours. Now try an older block.',
		restored:
			'Back to the original words, and every link fits again. A fingerprint only cares about the exact content.',
		rehash:
			'Sneaky. You recomputed every fingerprint on your own copy, so it looks perfect again. But the other computers still hold the original, and your last fingerprint matches none of them. Outvoted, your copy is simply ignored. On Bitcoin you would also need more computing power than the rest of the network put together.',
		synced:
			'You took the copy everyone agrees on. A new computer joining the network does the same, it downloads the chain and checks every link by itself.'
	},
	blockLabel: 'Block {n}',
	records: [
		'Ana pays Budi 5 coins',
		'Budi pays Citra 2 coins',
		'Citra pays Dodi 1 coin',
		'Dodi pays Ana 3 coins'
	],
	prevLabel: 'previous',
	hashLabel: 'fingerprint',
	editHint: 'Tap a block and change its words',
	brokenTag: 'link broken',
	changedTag: 'edited',
	rehashBtn: 'Recompute every fingerprint on my copy',
	syncBtn: "Take the network's copy",
	networkLabel: 'Copies on other computers',
	yourCopy: 'Your copy',
	computer: 'Computer {n}',
	agree: 'agrees',
	disagree: 'differs',
	shortNote: 'Fingerprints are cut to 8 characters here, real Bitcoin ones have 64.'
};
