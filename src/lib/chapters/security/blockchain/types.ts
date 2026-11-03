import type { LessonText } from '../../types';

export interface BlockchainText extends LessonText {
	blockLabel: string; // template with {n}
	/** What each of the four blocks records at the start. */
	records: string[];
	prevLabel: string; // the fingerprint of the block before, stored inside a block
	hashLabel: string; // this block's own fingerprint
	editHint: string;
	brokenTag: string; // on a block whose stored link no longer fits
	changedTag: string; // on the block the learner edited
	rehashBtn: string;
	syncBtn: string; // take the copy the other computers agree on
	networkLabel: string;
	yourCopy: string;
	computer: string; // template with {n}
	agree: string;
	disagree: string;
	shortNote: string; // explains the shortened fingerprints
}
