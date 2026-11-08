import type { LessonText } from '../../types';

export interface KeysText extends LessonText {
	/** Short names for the three acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}, e.g. "Babak {n}"
	nextAct: string; // moves on to the next act
	youLabel: string;
	friendLabel: string;
	friendSub: string; // the friend's address, always nimbus.com
	snooperLabel: string;
	/** The secret note, and how it looks once locked (Caesar shifted by three). */
	message: string;
	cipher: string;
	keyChip: string; // caption on the travelling key
	padlockChip: string; // caption on the travelling open padlock
	boxChip: string; // caption on the box once it is snapped shut
	privateKey: string; // the friend's private key, which never leaves
	sym: {
		sendKey: string;
		sendBox: string;
		copiedTag: string;
		readTag: string; // shown before the stolen message
		noteIdle: string;
		noteKey: string;
		noteRead: string;
	};
	asym: {
		askLock: string;
		sendBox: string;
		copiedTag: string;
		stuckTag: string;
		noteIdle: string;
		noteLock: string;
		noteSafe: string;
	};
	rsa: {
		multiplyBtn: string;
		instant: string; // small caption next to the instant product
		prompt: string; // template with {n}, asks which two primes make n
		pickHint: string; // explains the prime chips
		tries: string; // template with {n}
		triesOne: string; // the singular form, for exactly one try
		autoBtn: string; // lets Nim try the primes one by one
		nextBtn: string; // next, bigger number
		effortLabel: string; // heading over the effort bars
		realLabel: string; // heading over the real key sized number
		realDigits: string; // caption under it
		forever: string; // the last effort bar, a real key
	};
}
