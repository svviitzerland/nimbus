import type { LessonText } from '../../types';

export interface SignatureText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	devLabel: string;
	userLabel: string;
	attackerLabel: string;
	fileName: string; // the update file's name
	lines: [string, string, string]; // the three lines inside the update
	oneLetter: string; // the second line with a single letter changed
	tampered: string; // what the attacker swaps the second line for
	privateKey: string;
	publicKey: string;
	rule: string; // the memory trick, shown under the scene
	penLabel: string; // caption under the paper signed with a pen
	digitalLabel: string; // caption under the digitally signed file
	fingerprintLabel: string;
	check: {
		fromSig: string; // the fingerprint the signature opens to
		fromFile: string; // the fingerprint the phone computes from the file
		ok: string;
		bad: string;
	};
	/** The optional switch on the last beat. */
	toggle: { label: string; clean: string; tampered: string };
}
