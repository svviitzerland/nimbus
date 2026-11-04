import type { LessonText } from '../../types';

/** How the note travels on the road scene, with one shared key or with an open padlock. */
export type KeysMode = 'shared' | 'padlock';

export interface KeysText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	youLabel: string;
	friendLabel: string;
	snooperLabel: string;
	/** The secret note itself. */
	message: string;
	/** Small tags shown next to the eavesdropper. */
	tags: { copiedKey: string; copiedLock: string; read: string; stuck: string };
	sharedKey: string; // caption under the one shared key
	publicKey: string;
	privateKey: string;
	/** The memory trick scene, one caption per side. */
	rule: { anyone: string; only: string };
	rsa: {
		easy: string; // caption under the instant multiplication
		hard: string; // caption under the slow search
		tries: string; // template with {n}
	};
	secret: string; // the stamp on the hidden folder
	turing: { alt: string; caption: string };
	enigma: { alt: string; caption: string };
	/** The optional switch on the last beat. */
	modes: { label: string; shared: string; padlock: string };
}
