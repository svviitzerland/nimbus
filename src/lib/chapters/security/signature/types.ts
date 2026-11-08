import type { LessonText } from '../../types';

export interface SignatureText extends LessonText {
	/** Short names for the three acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}
	nextAct: string;
	devLabel: string;
	userLabel: string;
	attackerLabel: string;
	fileName: string; // the update file's name
	lines: string[]; // three lines inside the update
	/** Sneaky edits the attacker can slip in, each replaces one line of `lines`. */
	tampers: { btn: string; line: number; text: string }[];
	fingerprintLabel: string;
	signatureLabel: string;
	noSig: string; // shown before anything is signed
	nimbusKey: string; // who signed, the developer's private key
	attackerKey: string; // who signed, the attacker's private key
	hashBtn: string;
	signBtn: string;
	sendBtn: string;
	tamperHint: string;
	deliverBtn: string;
	retryBtn: string; // pulls the file back to the attacker after an untouched delivery
	forgeBtn: string;
	check: {
		heading: string;
		opened: string; // what the signature opens to with the public key
		computed: string; // the fingerprint the phone computes from the file
		ok: string;
		bad: string;
	};
}
