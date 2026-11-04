import type { LessonText } from '../../types';

export interface BlockchainText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	blockLabel: string; // template with {n}
	commitLabel: string; // template with {n}, the same block seen as a Git commit
	/** What each of the four blocks records. */
	records: [string, string, string, string];
	edited: string; // the second record after someone quietly changes it
	prevLabel: string; // the fingerprint of the block before, stored inside a block
	hashLabel: string; // this block's own fingerprint
	redoTag: string; // on a block that would have to be redone
	brokenTag: string; // on the link that no longer fits
	nonceLabel: string; // the number a miner keeps changing
	yourCopy: string;
	computer: string; // template with {n}
	rule: string; // the memory trick, shown under the chain
	/** The optional button on the last beat. */
	editBtn: string;
	restoreBtn: string;
}
