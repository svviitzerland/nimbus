import type { BlockchainText } from './types';

export const en: BlockchainText = {
	title: 'Blockchain',
	intro: [
		'Picture a notebook of who paid whom, kept by a whole village instead of one bank clerk. Everyone holds a copy, anyone can check it, and nobody can quietly rewrite an old page. That is the idea behind a <b>blockchain</b>.',
		'Each page is a <b>block</b> holding a few records. Every block also gets a <b>fingerprint</b>, a short code calculated from everything inside it (the hash, like in [[digital signatures|security/signature]]). Change anything inside and the fingerprint changes completely.',
		'Here is the trick. Every block also writes down the fingerprint of the block <b>before</b> it. So the blocks hang on each other like links in a chain, all the way back to the first one.',
		'Now watch someone sneak back and change an old amount, 5 becomes 50. That block gets a new fingerprint, and the next block still remembers the old one. The link snaps, and everyone can see it.',
		'[ingat] <b>Change one old page, and every page after it must be rewritten.</b> To hide the edit, a cheater would have to redo every block after it, and that is exactly what is made hard.',
		'And it is not one notebook, it is thousands of copies. Your copy with the edit disagrees with all the others, so the network simply ignores it. The version most computers agree on wins.',
		'This idea is older than you might think. In 1991, Stuart Haber and W. Scott Stornetta chained documents by fingerprint so nobody could backdate them. In 2008, someone calling themselves <b>Satoshi Nakamoto</b> added <b>mining</b>, where a computer must try number after number until the fingerprint starts with zeros, and built <b>Bitcoin</b> (live in January 2009). Who Satoshi really is, nobody knows.',
		'[fyi] Same trick, different world. [[Git|compute/version-control]] links every commit to the fingerprint of the one before it, so a secretly changed old commit stands out too. Git just has no coins and no mining.',
		'An honest note. A blockchain is slow and costly next to an ordinary database. It only shines when many parties need a shared record and do not trust any single keeper. Plenty of "put it on the blockchain" projects quietly shut down because a plain database would have done the job.',
		'If you like, change the amount in block 2 yourself and watch the chain snap, then put it back.'
	],
	reactions: {
		broken:
			'Snap. Block 2 got a new fingerprint, block 3 still remembers the old one, so the link breaks right there for everyone to see.',
		restored: 'Back to 5. The fingerprint is the same as before, and the whole chain fits again.'
	},
	steps: [
		{
			tag: 'The idea',
			title: 'A shared notebook',
			body: 'One record of who paid whom, copied to many people instead of kept by one clerk.'
		},
		{
			tag: 'One page',
			title: 'Block and fingerprint',
			body: 'A <b>block</b> holds a few records. Its <b>fingerprint</b> is calculated from everything inside it.'
		},
		{
			tag: 'The chain',
			title: 'Each block points back',
			body: 'Every block stores the fingerprint of the block before it. That stored fingerprint is the link.'
		},
		{
			tag: 'Tampering',
			title: 'The link snaps',
			body: 'Edit an old block and its fingerprint changes. The next block no longer fits, so the edit is visible at once.'
		},
		{
			tag: 'Remember it',
			title: 'One edit, all redone',
			body: 'Hiding a change means redoing <b>every</b> block after it. The further back, the more work.'
		},
		{
			tag: 'Many copies',
			title: 'The majority wins',
			body: 'Thousands of computers keep a copy. One copy that disagrees with the rest is simply ignored.'
		},
		{
			tag: '1991 to 2009',
			title: 'Mining and Bitcoin',
			body: 'To add a block, a computer changes one number (the <b>nonce</b>) again and again until the fingerprint starts with zeros. Slow on purpose, so redoing history costs a fortune.'
		},
		{
			tag: 'Same word',
			title: 'Git does it too',
			body: 'Every Git commit stores the fingerprint of the commit before it. A chain of blocks, without the coins.'
		},
		{
			tag: 'Be honest',
			title: 'Not for everything',
			body: 'Slow and costly. Worth it only when many parties share a record and trust nobody to keep it alone.'
		},
		{
			tag: 'Optional',
			title: 'Edit it yourself',
			body: 'Change the amount in block 2 and watch which link breaks. Then put it back.'
		}
	],
	blockLabel: 'Block {n}',
	commitLabel: 'Commit {n}',
	records: ['First page', 'Ana pays Budi 5', 'Budi pays Cici 2', 'Cici pays Dodi 1'],
	edited: 'Ana pays Budi 50',
	prevLabel: 'before',
	hashLabel: 'mine',
	redoTag: 'must redo',
	brokenTag: 'no match',
	nonceLabel: 'nonce',
	yourCopy: 'your copy',
	computer: 'copy {n}',
	rule: 'change one page, rewrite every page after it',
	editBtn: 'Change 5 to 50 in block 2',
	restoreBtn: 'Put it back to 5'
};
